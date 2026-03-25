// --- NEW: SEO Metadata for the Contact Route ---
export const metadata = {
  title: "Contact Us | ShivShakkti Tarot",
  description: "Have a question about a reading, an order, or a specific crystal? Send us a message and our energies will align shortly.",
};

export default function ContactLayout({ children }) {
  // This layout simply wraps your Client page and silently injects the metadata into the <head>
  return <>{children}</>;
}