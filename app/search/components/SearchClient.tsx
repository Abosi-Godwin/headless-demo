"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type SearchProduct = {
    id: string;
    title: string;
    handle: string;
    productType: string;
    tags: string[];
    featuredImage: { url: string; altText: string | null } | null;
    priceRange: {
        minVariantPrice: { amount: string; currencyCode: string };
    };
};

type Props = {
    products: SearchProduct[];
};

const ALL = "All";

const formatPrice = (amount: string, currency: string) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
    }).format(Number(amount));

const SearchClient = ({ products }: Props) => {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState(ALL);

    const categories = useMemo(
        () => [
            ALL,
            ...Array.from(
                new Set(products.map(product => product.productType).filter(Boolean))
            )
        ],
        [products]
    );

    const suggestions = useMemo(
        () => Array.from(new Set(products.flatMap(product => product.tags))).slice(0, 5),
        [products]
    );

    const term = query.trim().toLowerCase();

    const results = useMemo(
        () =>
            products.filter(product => {
                const inCategory =
                    category === ALL || product.productType === category;
                if (!inCategory) return false;
                if (!term) return true;
                return [product.title, product.productType, ...product.tags]
                    .join(" ")
                    .toLowerCase()
                    .includes(term);
            }),
        [products, term, category]
    );

    const reset = () => {
        setQuery("");
        setCategory(ALL);
    };

    return (
        <section className="mx-auto w-full max-w-4xl px-8 py-12 font-mono text-white">
            <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-white/50">
                Search
            </p>

            <form
                role="search"
                onSubmit={event => event.preventDefault()}
                className="relative"
            >
                <label htmlFor="q" className="sr-only">
                    Search the catalog
                </label>
                <input
                    id="q"
                    name="q"
                    type="search"
                    autoFocus
                    autoComplete="off"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Search the catalog"
                    className="w-full border border-white/15 bg-transparent py-4 pl-4 pr-20 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
                    >
                        Clear
                    </button>
                )}
            </form>

            {!term && suggestions.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                    {suggestions.map(suggestion => (
                        <button
                            key={suggestion}
                            type="button"
                            onClick={() => setQuery(suggestion)}
                            className="border border-white/15 px-3 py-2 text-[11px] uppercase tracking-widest text-white/60 transition-colors hover:border-white hover:text-white"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            {categories.length > 1 && (
                <div
                    role="tablist"
                    className="-mx-8 mt-8 flex gap-2 overflow-x-auto px-8 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {categories.map(item => {
                        const active = category === item;
                        return (
                            <button
                                key={item}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => setCategory(item)}
                                className={`shrink-0 border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                                    active
                                        ? "border-white bg-white text-black"
                                        : "border-white/15 text-white/60 hover:text-white"
                                }`}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="mt-8 flex items-baseline justify-between border-b border-white/15 pb-3">
                <h1 className="text-sm font-bold uppercase tracking-widest">
                    {term ? `Results for "${query.trim()}"` : "All issues"}
                </h1>
                <span className="text-xs text-white/50">
                    {results.length} {results.length === 1 ? "piece" : "pieces"}
                </span>
            </div>

            {results.length === 0 ? (
                <div className="mt-8 flex flex-col items-start gap-4 border border-white/15 p-6">
                    <p className="text-sm text-white/60">
                        Nothing in the catalog matches that.
                    </p>
                    <button
                        type="button"
                        onClick={reset}
                        className="border border-white/15 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white hover:text-white"
                    >
                        Reset search
                    </button>
                </div>
            ) : (
                <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
                    {results.map(product => (
                        <li key={product.id}>
                            <Link
                                href={`/products/${product.handle}`}
                                className="group flex flex-col gap-3"
                            >
                                <div className="aspect-[4/5] overflow-hidden border border-white/15 bg-white/[0.04]">
                                    {product.featuredImage ? (
                                        <img
                                            src={product.featuredImage.url}
                                            alt={product.featuredImage.altText ?? product.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                        />
                                    ) : (
                                        <div className="flex h-full items-end p-3 text-[10px] uppercase tracking-widest text-white/40">
                                            No image
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-xs font-bold uppercase tracking-wide">
                                        {product.title}
                                    </h2>
                                    {product.productType && (
                                        <p className="text-[11px] uppercase tracking-widest text-white/40">
                                            {product.productType}
                                        </p>
                                    )}
                                    <p className="text-sm text-white/80">
                                        {formatPrice(
                                            product.priceRange.minVariantPrice.amount,
                                            product.priceRange.minVariantPrice.currencyCode
                                        )}
                                    </p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default SearchClient;
