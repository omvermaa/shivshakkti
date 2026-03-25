
import { Cinzel_Decorative } from 'next/font/google';
import "./globals.css";
import { Providers } from "./components/Providers";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper"; // <-- NEW: Import wrapper
import { Toaster } from "./components/ui/sonner";

const cinzel = Cinzel_Decorative({ 
  weight: ['400', '700'], 
  subsets: ['latin'],
  variable: '--font-cinzel', 
});

// --- NEW: Global SEO Metadata ---
export const metadata = {
  title: {
    template: '%s | ShivShakkti Tarot',
    default: 'ShivShakkti Tarot - Mystical Items & Spiritual Guidance', 
  },
  description: 'Explore our mystical realms of tarot decks, healing crystals, energized spell jars, and spiritual jewelry. Elevate your spiritual journey with ShivShakkti.',
  keywords: ['Tarot', 'Crystals', 'Spell Jars', 'Spiritual Jewelry', 'Astrology', 'Healing Crystals India'],
  openGraph: {
    title: 'ShivShakkti Tarot',
    description: 'Explore our mystical realms of tarot decks, healing crystals, and energized spell jars.',
    url: 'https://shivshakkti.vercel.app',
    siteName: 'ShivShakkti Tarot',
    images: [
      {
        url: 'https://res.cloudinary.com/dxgvwi4uu/image/upload/v1774432129/cefyfe3zbpswjrfzwfdr.jpg', // A fallback image for link sharing
        width: 1200,
        height: 630,
        alt: 'ShivShakkti Tarot',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cinzel.variable}>
      <body className="bg-zinc-950 text-white min-h-screen flex flex-col">
        <Providers>
          
          {/* Wrap children in our new layout logic */}
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>

        </Providers>
        
        {/* Toaster stays globally available */}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}