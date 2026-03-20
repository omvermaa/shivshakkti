import { Cinzel_Decorative } from 'next/font/google';
import "./globals.css";


// Configure the font
const cinzel = Cinzel_Decorative({ 
  weight: ['400', '700'], 
  subsets: ['latin'],
  variable: '--font-cinzel', // This allows us to use it in Tailwind
});

export default function RootLayout({ children }) {
  return (
    // Apply the font variable to the HTML body
    <html lang="en" className={cinzel.variable}>
      <body className="bg-[#1a1a1a] text-white">
        {children}
      </body>
    </html>
  );
}