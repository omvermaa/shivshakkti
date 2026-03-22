import { Cinzel_Decorative } from 'next/font/google';
import "./globals.css";
import { Providers } from "./components/Providers";
import Navigation from "./components/Navigation"; 
import Footer from "./components/Footer"; // <-- 1. Import Footer

const cinzel = Cinzel_Decorative({ 
  weight: ['400', '700'], 
  subsets: ['latin'],
  variable: '--font-cinzel', 
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cinzel.variable}>
      <body className="bg-zinc-950 text-white min-h-screen flex flex-col">
        <Providers>
          <Navigation />
          
          {/* 2. Make main flex-grow so footer stays at the bottom on short pages */}
          <main className="flex-grow">
            {children}
          </main>

          <Footer /> {/* <-- 3. Add Footer here */}
        </Providers>
      </body>
    </html>
  );
}