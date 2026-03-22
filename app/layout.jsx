// import { Cinzel_Decorative } from 'next/font/google';
// import "./globals.css";
// import { Providers } from "./components/Providers";
// import Navigation from './components/Navigation';

// // Configure the font
// const cinzel = Cinzel_Decorative({ 
//   weight: ['400', '700'], 
//   subsets: ['latin'],
//   variable: '--font-cinzel', // This allows us to use it in Tailwind
// });

// export default function RootLayout({ children }) {
//   return (
//     // Apply the font variable to the HTML body
//     <html lang="en" className={cinzel.variable}>
//       <body className="bg-[#1a1a1a] text-white">
//         <Providers>
//           {children}
//         </Providers>
//       </body>
//     </html>
//   );
// }

import { Cinzel_Decorative } from 'next/font/google';
import "./globals.css";
import { Providers } from "./components/Providers";
import Navigation from "./components/Navigation"; // <-- Import it here!

const cinzel = Cinzel_Decorative({ 
  weight: ['400', '700'], 
  subsets: ['latin'],
  variable: '--font-cinzel', 
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cinzel.variable}>
      <body className="bg-zinc-950 text-white">
        <Providers>
          {/* Add Navigation above children so it appears on all pages */}
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}