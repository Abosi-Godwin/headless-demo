import { shopifyFetch } from "../../../lib/Shopify";
import { ProductCard } from "../../components/shared/ProductCard";
import { ShopifyProduct } from "../../../lib/types";
import { notFound } from "next/navigation";

interface CollectionResponse {
    collection: {
        title: string;
        products: { edges: { node: ShopifyProduct }[] };
    } | null;
}

interface AllProductsResponse {
    products: { edges: { node: ShopifyProduct }[] };
}

const COLLECTION_QUERY = `
  query Collection($handle: String!) {
    collection(handle: $handle) {
      title
      products(first: 24) {
        edges { node {
          id title handle
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
          productType
        }}
      }
    }
  }
`;

const ALL_PRODUCTS_QUERY = `{
  products(first: 24) {
    edges { node {
      id title handle
      featuredImage { url altText }
      priceRange { minVariantPrice { amount currencyCode } }
      productType
    }}
  }
}`;

export default async function CollectionPage({
    params
}: {
    params: Promise<{ handle: string }>;
}) {
    const { handle } = await params;

    let products: ShopifyProduct[] = [];
    let title = "";

    if (handle === "all") {
        const data = await shopifyFetch<AllProductsResponse>(ALL_PRODUCTS_QUERY);
        products = data.products.edges.map((e) => e.node);
        title = "Shop All";
    } else {
        const data = await shopifyFetch<CollectionResponse>(COLLECTION_QUERY, { handle });
        if (!data.collection) return notFound();
        products = data.collection.products.edges.map((e) => e.node);
        title = data.collection.title;
    }

    return (
        <div className="max-w-7xl mx-auto w-full px-8 py-12">
            <div className="flex items-center justify-between mb-8 border-b border-border-soft pb-4">
                <div>
                    <span className="font-mono text-xs tracking-widest uppercase text-foreground/60 block mb-1">
                        Collection
                    </span>
                    <h1 className="font-display text-3xl uppercase tracking-tight">
                        {title}
                    </h1>
                </div>
                <span className="font-mono text-xs tracking-widest uppercase text-foreground/50">
                    {products.length} {products.length === 1 ? "Item" : "Items"}
                </span>
            </div>

            {products.length === 0 ? (
                <p className="font-mono text-xs text-foreground/50 uppercase tracking-wide py-12 text-center">
                    No items currently issued in this category.
                </p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} bgClass="bg-border-soft/60" />
                    ))}
                </div>
            )}
        </div>
    );
}