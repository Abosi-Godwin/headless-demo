import { ProductCard } from "../shared/ProductCard";
import { ShopifyProduct } from "../../../lib/types";

export function EssentialsGrid({ products }: { products: ShopifyProduct[] }) {
    return (
        <section className="max-w-7xl mx-auto w-full p-8 mt-6">
            <div className="flex justify-between items-end mb-8 border-b border-border-soft pb-4">
                <div>
                    <span className="font-mono text-xs tracking-widest uppercase text-foreground/60">
                        Core Catalog
                    </span>
                    <h2 className="font-display text-xl uppercase mt-1">
                        The Essentials Line
                    </h2>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} bgClass="bg-border-soft/60" />
                ))}
            </div>
        </section>
    );
}