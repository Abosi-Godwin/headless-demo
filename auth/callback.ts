import { NextRequest, NextResponse } from "next/server";
import {
    authError,
    clearFlowCookies,
    COOKIE,
    exchangeCode,
    getConfig,
    safeNext,
    setSession
} from "../lib/CustomerAuth";

export const GET = async (request: NextRequest) => {
    try {
        const { siteUrl } = getConfig();
        const params = request.nextUrl.searchParams;
        const code = params.get("code");
        const state = params.get("state");
        const verifier = request.cookies.get(COOKIE.verifier)?.value;
        const savedState = request.cookies.get(COOKIE.state)?.value;
        const next = safeNext(request.cookies.get(COOKIE.next)?.value);

        if (!code || !state || !verifier || state !== savedState) {
            throw new Error(
                "Invalid or expired login attempt. Start again from /auth/login"
            );
        }

        const tokens = await exchangeCode(code, verifier);
        const response = NextResponse.redirect(`${siteUrl}${next}`);
        setSession(response, tokens);
        clearFlowCookies(response);
        return response;
    } catch (error) {
        return authError(error);
    }
};
