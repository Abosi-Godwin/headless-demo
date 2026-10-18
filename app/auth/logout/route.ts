import { NextRequest, NextResponse } from "next/server";
import {
    authError,
    clearSession,
    COOKIE,
    getConfig,
    getOpenIdConfig
} from "../../../lib/CustomerAuth";

export const POST = async (request: NextRequest) => {
    try {
        const { siteUrl } = getConfig();
        const idToken = request.cookies.get(COOKIE.id)?.value;
        let destination = siteUrl;

        if (idToken) {
            const { end_session_endpoint } = await getOpenIdConfig();
            const url = new URL(end_session_endpoint);
            url.searchParams.set("id_token_hint", idToken);
            url.searchParams.set("post_logout_redirect_uri", siteUrl);
            destination = url.toString();
        }

        const response = NextResponse.redirect(destination, 303);
        clearSession(response);
        return response;
    } catch (error) {
        return authError(error);
    }
};
