const endpoint = "https://mock.shop/api";

export async function shopifyFetch<T>(
    query: string,
    variables: Record<string, any> = {}
): Promise<T> {
    const res = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, variables }),
        cache: "no-store"
    });

    const text = await res.text();

    if (!res.ok) {
        throw new Error(
            `Shopify HTTP error ${res.status}: ${text.slice(0, 300)}`
        );
    }

    let json;
    try {
        json = JSON.parse(text);
    } catch {
        throw new Error(
            `Failed to parse Shopify response as JSON: ${text.slice(0, 300)}`
        );
    }

    if (json.errors) {
        throw new Error(
            `Shopify GraphQL errors: ${JSON.stringify(json.errors, null, 2)}`
        );
    }

    return json.data as T;
}