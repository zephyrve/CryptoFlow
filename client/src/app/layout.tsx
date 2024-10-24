import type {Metadata} from "next";
import Providers from "@/app/providers";
import {ThemeProvider} from "@/components/share/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
    title: "CryptoFlow",
    description: "Simplifying Crypto Payments for Everyone",
    icons: {
        icon: '/favicon.webp',
    },
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <Providers>
                {children}
            </Providers>
        </ThemeProvider>
        </body>
        </html>
    );
}
