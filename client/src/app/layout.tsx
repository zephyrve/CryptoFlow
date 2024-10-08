import {Metadata} from "next";
import AppProviders from "@/app/appProviders";

export const metadata: Metadata = {
    icons: {
        icon: '/favicon.webp',
    },
};

type RootLayoutProps = {
    children: React.ReactNode;
}

const RootLayout = ({children,}: Readonly<RootLayoutProps>) => (
    <html lang="en">
    <body>
    <AppProviders>
        {children}
    </AppProviders>
    </body>
    </html>
);
export default RootLayout
