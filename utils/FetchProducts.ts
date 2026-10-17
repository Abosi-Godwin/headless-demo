 



import { shopifyFetch } from "../lib/Shopify";
import { GraphQLResponse } from "../lib/types";

type DefaultNode = GraphQLResponse["products"]["edges"][number]["node"];

export const fetchProducts = async <T = DefaultNode>(
    query: string
): Promise<T[]> => {
    const data = await shopifyFetch<{ products: { edges: { node: T }[] } }>(
        query
    );
    return data.products.edges.map(edge => edge.node);
};
