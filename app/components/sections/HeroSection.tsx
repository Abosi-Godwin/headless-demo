import Image from "next/image";

const CATEGORIES = [
    { label: "Men", href: "/collections/men" },
    { label: "Women", href: "/collections/women" },
    { label: "Unisex", href: "/collections/unisex" },
    { label: "Accessories", href: "/collections/accessories" },
    { label: "Shoes", href: "/collections/shoes" },
    { label: "Tops", href: "/collections/tops" },
    { label: "Bottoms", href: "/collections/bottoms" }
];

export function HeroSection() {
    return (
        <>
            <section className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 px-8 pt-12 pb-8">
                <div className="md:col-span-5 flex flex-col justify-center">
                    <span className="font-mono text-xs tracking-widest uppercase text-accent border border-accent px-2 py-1 w-fit mb-6">
                        Standard Issue No. 001
                    </span>
                    <h1 className="font-display text-5xl lg:text-6xl uppercase leading-[0.95] tracking-tight mb-6">
                        Issued.
                        <br />
                        Not dropped.
                    </h1>
                    <p className="text-sm text-foreground/70 max-w-sm tracking-wide leading-relaxed mb-8">
                        No hype cycles. No countdown timers. Just the pieces you
                        actually reach for, cataloged and ready to issue.
                    </p>
                    <a
                        href="/collections"
                        className="w-fit bg-foreground text-background font-mono text-xs tracking-widest uppercase py-3.5 px-8 hover:bg-accent transition-colors"
                    >
                        View The Catalog
                    </a>
                </div>

                <div className="md:col-span-7 relative aspect-[4/3] md:aspect-auto w-full bg-paper overflow-hidden min-h-[420px]">
                    <Image
                        src="/hero-uniform (2).jpeg"
                        alt="Considered everyday basics, laid out flat"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>
            </section>

            <div className="max-w-7xl mx-auto w-full px-8 pb-16 border-t border-border-soft pt-6">
                <span
                    className="font-mono text-xs tracking-widest uppercase
                text-foreground/70 block mb-4"
                >
                    Select your category
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
                    {CATEGORIES.map(cat => (
                        <a
                            key={cat.label}
                            href={cat.href}
                            className="group flex items-center gap-2 text-sm font-medium uppercase tracking-wide"
                        >
                            <span className="w-4 h-4 border border-foreground/40 flex-shrink-0 group-hover:bg-accent group-hover:border-accent transition-colors" />
                            {cat.label}
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}
