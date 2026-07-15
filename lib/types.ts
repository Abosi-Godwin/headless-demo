
export interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    featuredImage?: { url: string; altText: string };
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
}

export interface GraphQLResponse {
    products: { edges: { node: ShopifyProduct }[] };
}
