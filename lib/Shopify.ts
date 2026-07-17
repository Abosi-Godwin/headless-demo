/*
const endpoint = "https://mock.shop/api";

export async function shopifyFetch<T>(
    query: string,
    variables = {}
): Promise<T> {
    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: 3600 }
    });

    const json = await res.json();

    if (json.errors) {
        console.error(json.errors);
        throw new Error("Failed to fetch Shopify API data");
    }

    return json.data;
}
*/



const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

const endpoint = `https://${domain}/api/2026-04/graphql.json`;

export async function shopifyFetch<T>(query: string, variables = {}): Promise<T> {
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Shopify-Storefront-Private-Token': token!,
        },
        body: JSON.stringify({ query, variables }),
        cache: 'no-store',
    });
    const json = await res.json();
    return json.data;
}