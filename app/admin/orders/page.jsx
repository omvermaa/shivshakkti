import { getAdminOrders } from "../../actions/order";
import OrderManager from "./OrderManager";

export default async function AdminOrdersPage() {
  // Fetch live order data directly from MongoDB
  const orders = await getAdminOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Orders</h1>
        <p className="text-zinc-400 mt-2">Manage customer orders and update shipping status.</p>
      </div>

      <OrderManager initialOrders={orders} />
    </div>
  );
}