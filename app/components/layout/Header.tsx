"use client";
import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "../../../stores/cartStore";
import { AnnouncementBar } from "./AnnouncementBar";

const NAV = [
    { label: "Shop All", href: "/collections/all" },
    { label: "Kit", href: "/kit" },
    { label: "Field Notes", href: "/field-notes" },
    { label: "About", href: "/about" }
];

export function Header() {
    const { toggleCart, cartItems } = useCart();
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <AnnouncementBar />
            <header className="w-full py-5 px-8 flex justify-between items-center border-b border-border-soft sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <a
                    href="/"
                    className="font-display text-lg uppercase tracking-tight"
                >
                    Uniform
                </a>
                <nav className="hidden md:flex space-x-8 font-mono text-xs tracking-widest uppercase">
                    {NAV.map(item => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="hover:text-accent transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
                <div className="flex items-center gap-5">
                    <Link
                        href="/search"
                        className="hover:text-accent transition-colors"
                        aria-label="Search the catalog"
                    >
                        <Search size={16} strokeWidth={1.5} />
                        <span className="sr-only">Search</span>
                    </Link>

                    <Link
                        href="/profile"
                        className="hover:text-accent transition-colors"
                        aria-label="View user profile"
                    >
                        <User size={16} strokeWidth={1.5} />
                        <span className="sr-only">Profile</span>
                    </Link>

                    <button
                        onClick={toggleCart}
                        className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase border border-border-soft px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
                    >
                        <ShoppingBag size={14} strokeWidth={1.5} />[{totalItems}
                        ]
                    </button>
                </div>
            </header>
        </>
    );
}
