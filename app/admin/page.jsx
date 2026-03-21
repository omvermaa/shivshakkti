import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { IndianRupee, ShoppingBag, PackageOpen } from "lucide-react";

const recentOrders = [
  { id: "ORD-001", customer: "Aanya Sharma", amount: 1200, status: "Paid", date: "Today" },
  { id: "ORD-002", customer: "Rahul Verma", amount: 850, status: "Pending", date: "Yesterday" },
  { id: "ORD-003", customer: "Priya Patel", amount: 2450, status: "Paid", date: "Mar 18" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Dashboard</h1>
        <p className="text-zinc-400 mt-2">Overview of your stores performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Revenue</CardTitle>
            <IndianRupee className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">₹45,231</div>
            <p className="text-xs text-emerald-400 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Active Orders</CardTitle>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">14</div>
            <p className="text-xs text-zinc-500 mt-1">3 awaiting fulfillment</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Products</CardTitle>
            <PackageOpen className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">42</div>
            <p className="text-xs text-zinc-500 mt-1">Across 5 categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-100">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
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
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell className="font-medium text-purple-400">{order.id}</TableCell>
                  <TableCell className="text-zinc-300">{order.customer}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={order.status === 'Paid' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : 'border-amber-500/50 text-amber-400 bg-amber-500/10'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-400">{order.date}</TableCell>
                  <TableCell className="text-right text-zinc-300 font-medium">₹{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}