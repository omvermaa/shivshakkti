import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getProducts } from "../../actions/product";
import ProductManager from "./ProductManager";

export const dynamic = "force-dynamic";

export default async function ManageProductsPage() {
  // --- ADDED SECURITY CHECK ---
  const session = await getServerSession(authOptions);
  if (!session || session?.user?.role !== "admin") {
    redirect("/admin-login");
  }

  // Fetch live data directly from MongoDB before the page loads
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Products</h1>
        <p className="text-zinc-400 mt-2">Manage your inventory and product listings.</p>
      </div>

      {/* Render the interactive table and pass in the database products */}
      <ProductManager initialProducts={products} />
    </div>
  );
}