import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const COOKIE = {
    access: "ca_access",
    refresh: "ca_refresh",
    id: "ca_id",
    verifier: "ca_verifier",
    state: "ca_state",
    next: "ca_next"
} as const;

type OpenIdConfig = {
    authorization_endpoint: string;
    token_endpoint: string;
    end_session_endpoint: string;
};

export type TokenResponse = {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
    expires_in: number;
};

const DAY = 60 * 60 * 24;
const FLOW_TTL = 60 * 10;

export const getConfig = () => {
    const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN?.replace(
        /^https?:\/\//,
        ""
    ).replace(/\/$/, "");
    const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
    const siteUrl = process.env.SITE_URL?.replace(/\/$/, "");

    if (!shopDomain || !clientId || !siteUrl) {
        throw new Error(
            "Set SHOPIFY_SHOP_DOMAIN, SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID and SITE_URL"
        );
    }

    return {
        shopDomain,
        clientId,
        siteUrl,
        redirectUri: `${siteUrl}/auth/callback`
    };
};

const cookieOptions = (maxAge: number) => ({
    httpOnly: true,
    secure: getConfig().siteUrl.startsWith("https://"),
    sameSite: "lax" as const,
    path: "/",
    maxAge
});

const discover = async <T>(path: string): Promise<T> => {
    const { shopDomain } = getConfig();
    const res = await fetch(`https://${shopDomain}${path}`, {
        next: { revalidate: 3600 }
    });
    const text = await res.text();

    if (!res.ok) {
        throw new Error(`Discovery at ${path} failed with ${res.status}`);
    }

    try {
        return JSON.parse(text) as T;
    } catch {
        throw new Error(
            `Discovery at ${path} did not return JSON. If the dev store has a storefront password, remove it.`
        );
    }
};

export const getOpenIdConfig = () =>
    discover<OpenIdConfig>("/.well-known/openid-configuration");

export const getGraphqlUrl = async () => {
    const config = await discover<{ graphql_api: string }>(
        "/.well-known/customer-account-api"
    );
    return config.graphql_api;
};

export const createPkce = () => {
    const verifier = randomBytes(32).toString("base64url");

    return {
        verifier,
        challenge: createHash("sha256").update(verifier).digest("base64url"),
        state: randomBytes(16).toString("base64url")
    };
};

export const safeNext = (value?: string | null) =>
    value && value.startsWith("/") && !value.startsWith("//")
        ? value
        : "/profile";

const requestToken = async (
    params: Record<string, string>
): Promise<TokenResponse> => {
    const { clientId, siteUrl } = getConfig();
    const { token_endpoint } = await getOpenIdConfig();

    const res = await fetch(token_endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: siteUrl
        },
        body: new URLSearchParams({ client_id: clientId, ...params }),
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error(
            `Token request failed with ${res.status}: ${(await res.text()).slice(0, 300)}`
        );
    }

    return res.json() as Promise<TokenResponse>;
};

export const exchangeCode = (code: string, verifier: string) =>
    requestToken({
        grant_type: "authorization_code",
        redirect_uri: getConfig().redirectUri,
        code,
        code_verifier: verifier
    });

export const refreshTokens = (refreshToken: string) =>
    requestToken({
        grant_type: "refresh_token",
        refresh_token: refreshToken
    });

export const setFlowCookies = (
    response: NextResponse,
    flow: { verifier: string; state: string; next: string }
) => {
    response.cookies.set(COOKIE.verifier, flow.verifier, cookieOptions(FLOW_TTL));
    response.cookies.set(COOKIE.state, flow.state, cookieOptions(FLOW_TTL));
    response.cookies.set(COOKIE.next, flow.next, cookieOptions(FLOW_TTL));
};

export const clearFlowCookies = (response: NextResponse) => {
    [COOKIE.verifier, COOKIE.state, COOKIE.next].forEach(name => {
        response.cookies.delete(name);
    });
};

export const setSession = (response: NextResponse, tokens: TokenResponse) => {
    response.cookies.set(
        COOKIE.access,
        tokens.access_token,
        cookieOptions(Math.max(tokens.expires_in - 60, 60))
    );

    if (tokens.refresh_token) {
        response.cookies.set(
            COOKIE.refresh,
            tokens.refresh_token,
            cookieOptions(DAY * 30)
        );
    }

    if (tokens.id_token) {
        response.cookies.set(COOKIE.id, tokens.id_token, cookieOptions(DAY * 30));
    }
};

export const clearSession = (response: NextResponse) => {
    [COOKIE.access, COOKIE.refresh, COOKIE.id].forEach(name => {
        response.cookies.delete(name);
    });
};

export const requireAccessToken = async (next: string) => {
    const store = await cookies();
    const access = store.get(COOKIE.access)?.value;

    if (access) {
        return access;
    }

    const target = encodeURIComponent(next);

    if (store.get(COOKIE.refresh)?.value) {
        redirect(`/auth/refresh?next=${target}`);
    }

    redirect(`/auth/login?next=${target}`);
};

export const authError = (error: unknown) =>
    NextResponse.json(
        {
            error:
                error instanceof Error ? error.message : "Authentication failed"
        },
        { status: 500 }
    );
    