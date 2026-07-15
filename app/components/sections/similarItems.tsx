import { shopifyFetch } from "../../../lib/Shopify";
import { ProductCard } from "../shared/ProductCard";
import { ShopifyProduct } from "../../../lib/types";

interface ProductsResponse {
    products: { edges: { node: ShopifyProduct }[] };
}

const PRODUCTS_QUERY = `{
  products(first: 24) {
    edges { node {
      id title handle
      featuredImage { url altText }
      priceRange { minVariantPrice { amount currencyCode } }
      productType
    }}
  }
}`;

export async function SimilarItems({
    productType,
    currentProductId
}: {
    productType: string;
    currentProductId: string;
}) {
    const data = await shopifyFetch<ProductsResponse>(PRODUCTS_QUERY);
    const all = data.products.edges.map((e) => e.node).filter((p) => p.id !== currentProductId);

    const sameType = productType ? all.filter((p) => p.productType === productType) : [];
    const items = (sameType.length > 0 ? sameType : all).slice(0, 4);

    if (items.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto w-full px-8 py-16 border-t border-border-soft mt-12">
            <span className="font-mono text-xs tracking-widest uppercase text-foreground/60 block mb-6">
                You May Also Need
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {items.map((p) => (
                    <ProductCard key={p.id} product={p} bgClass="bg-paper" />
                ))}
            </div>
        </section>
    );
}