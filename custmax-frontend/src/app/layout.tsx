import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import dynamic from "next/dynamic";
import Script from 'next/script'; // Next.js 提供的 Script 组件

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Email Marketing Platform | Cusob",
    description: "CusOb",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    // 动态加载组件，无需在服务端渲染
    const CrispWithNoSSR = dynamic(
        () => import('../component/Crisp/index'),
        { ssr: false }
    );

    return (
        <html lang="en">
        <head>
            {/* Google Tag Manager */}
            <Script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=G-9B4TXJVBQZ`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-9B4TXJVBQZ');
                `}
            </Script>
        </head>
        <body className={inter.className}>
        <AntdRegistry>{children}</AntdRegistry>
        <CrispWithNoSSR />
        </body>
        </html>
    );
}