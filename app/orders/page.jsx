import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getUserOrders } from "../actions/order";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Package, Truck, CheckCircle2, Clock, AlertCircle } from "lucide-react";

// Helper function to convert MongoDB UTC time to IST
const formatToIST = (utcDateString) => {
  const date = new Date(utcDateString);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
};

export default async function MyOrdersPage() {
  // 1. Secure the route
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/user-login");
  }

  // 2. Fetch the user's orders
  const res = await getUserOrders();
  const orders = res.success ? res.orders : [];

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12 px-6 lg:px-12 text-zinc-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 flex items-center">
            <Package className="w-8 h-8 mr-3 text-purple-400" />
            My Orders
          </h1>
          <p className="text-zinc-400 mt-2">Track your shipments and view past purchases.</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
            <Package className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-zinc-300 mb-2">No orders yet</h2>
            <p className="text-zinc-500 mb-6">When you buy mystical items, they will appear here.</p>
            <Link href="/shop" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
                
                {/* Order Header (Status & ID) */}
                <CardHeader className="bg-zinc-950/50 border-b border-zinc-800 p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm text-zinc-400 font-mono">Order #{order._id.slice(-8).toUpperCase()}</span>
                      {/* <Badge variant="outline" className={`border-0 ${
                        order.paymentMethod === 'Prepaid' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {order.paymentMethod}
                      </Badge> */}
                    </div>
                    <p className="text-sm text-zinc-500 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      {formatToIST(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    {/* Delivery Status Badge */}
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.deliveryStatus === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                      order.deliveryStatus === 'Shipped' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-zinc-800 text-zinc-300'
                    }`}>
                      {order.deliveryStatus === 'Delivered' ? <CheckCircle2 className="w-4 h-4 mr-2" /> :
                       order.deliveryStatus === 'Shipped' ? <Truck className="w-4 h-4 mr-2" /> :
                       <Clock className="w-4 h-4 mr-2" />}
                      {order.deliveryStatus}
                    </div>
                  </div>
                </CardHeader>

                {/* Order Items */}
                <CardContent className="p-0">
                  <div className="divide-y divide-zinc-800">
                    {order.items.map((item, index) => (
                      <div key={index} className="p-5 sm:px-6 flex items-center gap-4">
                        <div className="w-16 h-16 relative rounded-md bg-zinc-800 border border-zinc-700 flex-shrink-0 overflow-hidden">
                          {item.product?.images?.[0] ? (
                            <Image 
                              src={item.product.images[0]} 
                              alt={item.name} 
                              fill 
                              className="object-cover" 
                              unoptimized 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-zinc-100 font-medium truncate">{item.name}</h4>
                          <p className="text-sm text-zinc-400 mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <p className="text-zinc-100 font-medium">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-zinc-800" />

                  {/* Order Footer (Payment Status & Total) */}
                  <div className="p-5 sm:px-6 flex items-center justify-between bg-zinc-950/30">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-400">Payment Status:</span>
                      <span className={`text-sm font-bold tracking-wide uppercase ${
                        order.paymentMethod === 'Prepaid || COD' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-zinc-400 mr-3">Order Total:</span>
                      <span className="text-xl font-bold text-purple-400">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </CardContent>

              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}