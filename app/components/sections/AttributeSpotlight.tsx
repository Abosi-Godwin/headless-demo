import Image from "next/image";
import { ShopifyProduct } from "../../lib/types";

export function AttributeSpotlight({ product }: { product: ShopifyProduct }) {
    return (
        <section className="bg-border-soft/20 border-y border-border-soft py-16 px-8 my-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <span className="font-mono text-xs tracking-widest uppercase text-accent">
                    Core Issue
                </span>
                <h2 className="font-display text-2xl uppercase mt-1">
                    The Standard, Explained
                </h2>
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="space-y-8 text-right order-2 md:order-1">
                    <div className="p-4 border-b border-border-soft">
                        <h4 className="font-mono text-sm font-medium uppercase tracking-wider mb-1">
                            Reinforced Construction
                        </h4>
                        <p className="text-xs text-foreground/70">
                            Stress points double-stitched to survive daily wear, not just the photo.
                        </p>
                    </div>
                    <div className="p-4 border-b border-border-soft">
                        <h4 className="font-mono text-sm font-medium uppercase tracking-wider mb-1">
                            Honest Materials
                        </h4>
                        <p className="text-xs text-foreground/70">
                            Canvas, cotton, and blends chosen for durability first, trend second.
                        </p>
                    </div>
                </div>

                <div className="relative aspect-square w-full max-w-[320px] mx-auto bg-paper overflow-hidden order-1 md:order-2">
                    {product?.featuredImage?.url && (
                        <Image
                            src={product.featuredImage.url}
                            alt={product.title}
                            fill
                            className="object-cover p-6"
                        />
                    )}
                </div>

                <div className="space-y-8 text-left order-3">
                    <div className="p-4 border-b border-border-soft">
                        <h4 className="font-mono text-sm font-medium uppercase tracking-wider mb-1">
                            Considered Fit
                        </h4>
                        <p className="text-xs text-foreground/70">
                            Sizing held consistent across the catalog, not roulette between pieces.
                        </p>
                    </div>
                    <div className="p-4 border-b border-border-soft">
                        <h4 className="font-mono text-sm font-medium uppercase tracking-wider mb-1">
                            Built To Outlast
                        </h4>
                        <p className="text-xs text-foreground/70">
                            Made to earn character over time, not get replaced next season.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}