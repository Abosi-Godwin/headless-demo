import { NextRequest, NextResponse } from "next/server";
import {
    authError,
    clearSession,
    COOKIE,
    getConfig,
    refreshTokens,
    safeNext,
    setSession
} from "../../lib/CustomerAuth";

export const GET = async (request: NextRequest) => {
    try {
        const { siteUrl } = getConfig();
        const next = safeNext(request.nextUrl.searchParams.get("next"));
        const login = `${siteUrl}/auth/login?next=${encodeURIComponent(next)}`;
        const refresh = request.cookies.get(COOKIE.refresh)?.value;

        if (!refresh) {
            return NextResponse.redirect(login);
        }

        try {
            const tokens = await refreshTokens(refresh);
            const response = NextResponse.redirect(`${siteUrl}${next}`);
            setSession(response, tokens);
            return response;
        } catch {
            const response = NextResponse.redirect(login);
            clearSession(response);
            return response;
        }
    } catch (error) {
        return authError(error);
    }
};
