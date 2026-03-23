import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getAdminOrders } from "../actions/order";
import { getProducts } from "../actions/product";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { IndianRupee, ShoppingBag, PackageOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Security Check
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    redirect("/admin-login");
  }

  // Fetch live data from database
  const orders = await getAdminOrders() || [];
  const products = await getProducts() || [];

  // --- CALCULATE DYNAMIC KPIs ---
  
  // 1. Total Revenue (Excluding failed payments)
  const validOrders = orders.filter(o => o.paymentStatus !== "Failed");
  const totalRevenue = validOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  // 2. Active Orders (Not yet delivered)
  const activeOrders = orders.filter(o => o.deliveryStatus !== "Delivered");
  const pendingFulfillmentCount = orders.filter(o => o.deliveryStatus === "Pending").length;

  // 3. Product Stats
  const totalProductsCount = products.length;
  // Use a Set to find exactly how many unique categories exist in your DB
  const uniqueCategoriesCount = new Set(products.map(p => p.category)).size;

  // 4. Recent Orders (Get the top 5 newest orders)
  // Assuming getAdminOrders sorts by newest first
  const recentOrdersList = orders.slice(0, 5);

  // Helper function to format the order dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Dashboard</h1>
        <p className="text-zinc-400 mt-2">Overview of your store's live performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Revenue</CardTitle>
            <IndianRupee className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-zinc-500 mt-1">From {validOrders.length} successful orders</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Orders</CardTitle>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{activeOrders.length}</div>
            <p className="text-xs text-zinc-500 mt-1">{pendingFulfillmentCount} awaiting fulfillment</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Products</CardTitle>
            <PackageOpen className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{totalProductsCount}</div>
            <p className="text-xs text-zinc-500 mt-1">Across {uniqueCategoriesCount} categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-100">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-zinc-800">
                <TableRow className="hover:bg-transparent border-zinc-800">
                  <TableHead className="text-zinc-400">Order ID</TableHead>
                  <TableHead className="text-zinc-400">Customer</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400">Date</TableHead>
                  <TableHead className="text-zinc-400 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrdersList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-zinc-500">
                      No orders placed yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrdersList.map((order) => (
                    <TableRow key={order._id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                      <TableCell className="font-medium text-purple-400 font-mono text-xs">
                        {order._id.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {order.customerDetails?.name || "Guest"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-0 ${
                          order.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 
                          order.paymentStatus === 'Failed' ? 'bg-rose-500/10 text-rose-400' : 
                          'bg-amber-500/10 text-amber-400'
                        }`}>
                          {order.paymentStatus || "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-right text-zinc-300 font-medium whitespace-nowrap">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}