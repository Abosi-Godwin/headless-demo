import Image from "next/image";

export function SocialProofBanner() {
    return (
        <section className="relative w-full bg-foreground text-background py-20 px-8 mt-12 overflow-hidden min-h-[380px] flex items-center">
            <Image
                src="/social-proof-bg.jpg"
                alt="Canvas texture, considered materials"
                fill
                className="object-cover opacity-20"
            />
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                <div className="flex space-x-12">
                    <div>
                        <span className="font-display text-4xl lg:text-5xl block mb-1">94%</span>
                        <span className="font-mono text-xs tracking-widest uppercase text-background/70">
                            Reorder Rate On Core Basics
                        </span>
                    </div>
                    <div>
                        <span className="font-display text-4xl lg:text-5xl block mb-1">4.9★</span>
                        <span className="font-mono text-xs tracking-widest uppercase text-background/70">
                            From Over 15,000 Issued Orders
                        </span>
                    </div>
                </div>

                <div className="flex flex-col md:items-end">
                    <div className="w-full max-w-md">
                        <h3 className="font-display text-lg uppercase mb-3">Join The Manifest</h3>
                        <div className="flex border-b border-background/40 pb-2">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="bg-transparent font-mono text-sm w-full outline-none border-none placeholder:text-background/40 text-background"
                            />
                            <button className="font-mono text-xs font-bold tracking-widest uppercase px-2 hover:text-accent transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}