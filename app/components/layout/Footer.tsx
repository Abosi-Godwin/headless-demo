export function Footer() {
    return (
        <footer className="bg-[#161512] text-[#EDEAE3]/90 pt-16 pb-8 px-8 border-t border-border-soft">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-[#3A362E]">
                <div className="md:col-span-5 space-y-4">
                    <div className="font-display text-base text-white uppercase">Uniform</div>
                    <p className="font-mono text-xs text-[#EDEAE3]/60 max-w-sm leading-relaxed tracking-wide">
                        Considered basics, cataloged and issued. No drops, no hype cycles, just the pieces you actually reach for.
                    </p>
                </div>

                <div className="md:col-span-3 md:col-start-7 flex flex-col space-y-2.5">
                    <span className="font-mono text-xs font-bold text-white tracking-widest uppercase mb-1">
                        Quick Links
                    </span>
                    <a href="/collections/all" className="font-mono text-xs text-[#EDEAE3]/60 hover:text-white transition-colors">
                        Shop All
                    </a>
                    <a href="/field-notes" className="font-mono text-xs text-[#EDEAE3]/60 hover:text-white transition-colors">
                        Field Notes
                    </a>
                </div>

                <div className="md:col-span-3 flex flex-col space-y-2.5">
                    <span className="font-mono text-xs font-bold text-white tracking-widest uppercase mb-1">
                        Support Desk
                    </span>
                    <a href="#" className="font-mono text-xs text-[#EDEAE3]/60 hover:text-white transition-colors">
                        Order Tracking
                    </a>
                    <a href="#" className="font-mono text-xs text-[#EDEAE3]/60 hover:text-white transition-colors">
                        Sizing Guide
                    </a>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between font-mono text-[10px] tracking-widest uppercase text-[#EDEAE3]/40">
                <p>© 2026 Uniform. All Rights Reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white">Privacy</a>
                    <a href="#" className="hover:text-white">Terms</a>
                </div>
            </div>
        </footer>
    );
}