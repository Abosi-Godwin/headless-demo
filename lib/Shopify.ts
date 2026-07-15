
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
