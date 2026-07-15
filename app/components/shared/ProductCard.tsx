import Image from "next/image";
import { ShopifyProduct } from "../../lib/types";

function getIssueNumber(id: string) {
    const digits = id.replace(/\D/g, "");
    return digits.slice(-5).padStart(5, "0");
}

export function ProductCard({
    product,
    bgClass = "bg-paper"
}: {
    product: ShopifyProduct;
    bgClass?: string;
}) {
    return (
        <a
            href={`/products/${product.handle}`}
            className="group flex flex-col"
        >
            <div className={`relative aspect-[4/5] w-full overflow-hidden ${bgClass}`}>
                {product.featuredImage?.url && (
                    <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText ?? product.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                )}
                <span className="absolute top-3 left-3 font-mono text-[10px] tracking-widest uppercase bg-background/90 px-2 py-1 border border-border-soft">
                    No. {getIssueNumber(product.id)}
                </span>
                {product.productType && (
                    <span className="absolute top-3 right-3 font-mono text-[10px] tracking-widest uppercase text-accent border border-accent px-2 py-1 -rotate-3 bg-background/90">
                        {product.productType}
                    </span>
                )}
            </div>
            <div className="tear-line pt-3 flex items-center justify-between">
                <h4 className="text-xs tracking-wider uppercase font-medium line-clamp-1">
                    {product.title}
                </h4>
                <p className="font-mono text-xs text-foreground/70 flex-shrink-0 ml-2">
                    ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                </p>
            </div>
        </a>
    );
}