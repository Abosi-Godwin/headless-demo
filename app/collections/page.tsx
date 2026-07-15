const CATEGORIES = [
    { label: "Men", handle: "men" },
    { label: "Women", handle: "women" },
    { label: "Unisex", handle: "unisex" },
    { label: "Accessories", handle: "accessories" },
    { label: "Shoes", handle: "shoes" },
    { label: "Tops", handle: "tops" },
    { label: "Bottoms", handle: "bottoms" },
];

export default function CollectionsIndexPage() {
    return (
        <div className="max-w-7xl mx-auto w-full px-8 py-12">
            <div className="mb-8 border-b border-border-soft pb-4">
                <span className="font-mono text-xs tracking-widest uppercase text-foreground/60 block mb-1">
                    Browse By Category
                </span>
                <h1 className="font-display text-3xl uppercase tracking-tight">
                    Collections
                </h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {CATEGORIES.map((cat) => (
                    <a
                        key={cat.handle}
                        href={`/collections/${cat.handle}`}
                        className="group relative aspect-[4/5] bg-paper border border-border-soft overflow-hidden flex items-end p-4"
                    >
                        <span className="font-mono text-xs tracking-widest uppercase group-hover:text-accent transition-colors">
                            {cat.label}
                        </span>
                    </a>
                ))}
                <a
                    href="/collections/all"
                    className="group relative aspect-[4/5] bg-foreground text-background overflow-hidden flex items-end p-4"
                >
                    <span className="font-mono text-xs tracking-widest uppercase group-hover:text-accent transition-colors">
                        View All
                    </span>
                </a>
            </div>
        </div>
    );
}