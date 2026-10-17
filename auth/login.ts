import { NextRequest, NextResponse } from "next/server";
import {
    authError,
    createPkce,
    getConfig,
    getOpenIdConfig,
    safeNext,
    setFlowCookies
} from "../../../lib/CustomerAuth";

export const GET = async (request: NextRequest) => {
    try {
        const { clientId, redirectUri } = getConfig();
        const { authorization_endpoint } = await getOpenIdConfig();
        const { verifier, challenge, state } = createPkce();
        const next = safeNext(request.nextUrl.searchParams.get("next"));

        const url = new URL(authorization_endpoint);
        url.searchParams.set("client_id", clientId);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("redirect_uri", redirectUri);
        url.searchParams.set("scope", "openid email customer-account-api:full");
        url.searchParams.set("state", state);
        url.searchParams.set("code_challenge", challenge);
        url.searchParams.set("code_challenge_method", "S256");

        const response = NextResponse.redirect(url);
        setFlowCookies(response, { verifier, state, next });
        return response;
    } catch (error) {
        return authError(error);
    }
};
