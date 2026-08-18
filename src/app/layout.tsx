import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Anek_Bangla } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { db } from "@/lib/db";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const anekBangla = Anek_Bangla({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Dynamic metadata — fetches SEO settings from DB
export async function generateMetadata(): Promise<Metadata> {
  let seo;
  try {
    seo = await db.seoSetting.findUnique({ where: { id: "global" } });
  } catch {
    // DB might not be ready during build — fall back to defaults
  }

  const siteName = seo?.siteName ?? "Nabil Amin Hridoy";
  const metaTitle = seo?.metaTitleEn ?? "Nabil Amin Hridoy — Full Stack Developer";
  const metaDescription = seo?.metaDescriptionEn ?? "Premium portfolio of Nabil Amin Hridoy, a Full Stack Developer.";
  const ogTitle = seo?.ogTitleEn ?? metaTitle;
  const ogDescription = seo?.ogDescriptionEn ?? metaDescription;
  const ogImageUrl = seo?.ogImageUrl ?? undefined;
  const twitterCard = seo?.twitterCard ?? "summary_large_image";
  const twitterSite = seo?.twitterSite ?? undefined;
  const twitterCreator = seo?.twitterCreator ?? undefined;
  const canonicalUrl = seo?.canonicalUrl ?? undefined;

  const verification: NonNullable<Metadata['verification']> = {};
  if (seo?.googleVerification) {
    verification.google = seo.googleVerification;
  }
  if (seo?.bingVerification) {
    verification.other = { msvalidate01: seo.bingVerification };
  }

  return {
    title: {
      default: metaTitle,
      template: `%s | ${siteName}`,
    },
    description: metaDescription,
    keywords: [
      "Nabil Amin Hridoy",
      "Full Stack Developer",
      "Next.js",
      "React",
      "Node.js",
      "TypeScript",
      "Portfolio",
      "Bangladesh Developer",
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    metadataBase: canonicalUrl ? new URL(canonicalUrl) : undefined,
    alternates: {
      canonical: canonicalUrl ?? undefined,
    },
    icons: {
      icon: "/logo.svg",
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
      siteName,
    },
    twitter: {
      card: twitterCard as "summary" | "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      site: twitterSite,
      creator: twitterCreator,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    verification: Object.keys(verification).length > 0 ? verification : undefined,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${anekBangla.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <SonnerToaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
