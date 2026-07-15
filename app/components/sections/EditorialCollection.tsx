 import Image from "next/image";
import { ProductCard } from "../shared/ProductCard";
import { ShopifyProduct } from "../../../lib/types";

export function EditorialCollection({
    products
}: {
    products: ShopifyProduct[];
}) {
    return (
        <section className="max-w-7xl mx-auto w-full p-8">
            <div className="flex justify-between items-end mb-8 border-b border-border-soft pb-4">
                <div>
                    <span className="font-mono text-xs tracking-widest uppercase text-foreground/60">
                        Field Notes / Vol. 01
                    </span>
                    <h2 className="font-display text-xl uppercase mt-1">
                        Built To Layer
                    </h2>
                </div>
                <a
                    href="/field-notes"
                    className="font-mono text-xs tracking-widest uppercase border-b border-foreground pb-1 hover:text-accent hover:border-accent transition-colors"
                >
                    Full Archive
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 relative aspect-[4/5] lg:aspect-auto w-full bg-foreground text-background p-8 flex flex-col justify-end overflow-hidden min-h-[500px]">
                    <Image
                        src="/field-notes-01.jpg"
                        alt="Considered layering, workwear basics"
                        fill
                        className="object-cover opacity-40 mix-blend-luminosity"
                    />
                    <div className="relative z-10 max-w-xs">
                        <h3 className="font-display text-2xl uppercase mb-2">
                            The Off-Duty Standard
                        </h3>
                        <p className="text-xs text-background/80 tracking-wide mb-6 leading-relaxed">
                            Three pieces, one considered pairing. Built for the days that don't need a uniform of their own.
                        </p>
                        <button className="bg-background text-foreground font-mono text-xs tracking-widest uppercase py-3 px-6 hover:bg-accent hover:text-accent-foreground transition-colors">
                            Shop The Pairing
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-2 gap-6">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </div>
        </section>
    );
}