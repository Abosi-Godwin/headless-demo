import { Archivo_Black, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/layout/CartDrawer";

const archivoBlack = Archivo_Black({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-archivo-black",
});

const plexSans = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-plex-mono",
});

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${archivoBlack.variable} ${plexSans.variable} ${plexMono.variable}`}>
            <body>
                <Header />
                {children}
                <Footer />
                <CartDrawer />
                <Toaster
                    position="bottom-center"
                    toastOptions={{
                        style: {
                            background: "#1C1B19",
                            color: "#F5F3EE",
                            borderRadius: "0px",
                            fontFamily: "var(--font-plex-mono)",
                            fontSize: "12px",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            border: "1px solid #B23A2E",
                        },
                    }}
                />
            </body>
        </html>
    );
}