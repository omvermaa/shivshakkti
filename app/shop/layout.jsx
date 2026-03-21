import Navigation from "../components/Navigation";

export default function ShopLayout({ children }) {
  return (
    <>
    <Navigation/>
      {children}
    </>
  );
}
