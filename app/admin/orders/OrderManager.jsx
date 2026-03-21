"use client";

import { useState } from "react";
import { updateDeliveryStatus } from "../../actions/order";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Search, Loader2 } from "lucide-react";

export default function OrderManager({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Filter orders by customer name, email, or order ID
  const filteredOrders = orders.filter(o => 
    o.customerDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerDetails.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o._id.includes(searchQuery)
  );

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    
    const result = await updateDeliveryStatus(orderId, newStatus);
    
    if (result.success) {
      // Optimistically update the UI without reloading the page
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, deliveryStatus: newStatus } : order
      ));
    } else {
      alert("Failed to update status.");
    }
    
    setUpdatingId(null);
  };

  // Helper to format the MongoDB timestamp
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 text-zinc-50">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search by name, email, or Order ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-purple-500/50"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow className="hover:bg-transparent border-zinc-800">
              <TableHead className="text-zinc-400">Order Details</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
              <TableHead className="text-zinc-400">Payment</TableHead>
              <TableHead className="text-zinc-400">Total Amount</TableHead>
              <TableHead className="text-zinc-400">Delivery Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order._id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                  
                  {/* Customer Details */}
                  <TableCell>
                    <div className="font-medium text-zinc-100">{order.customerDetails.name}</div>
                    <div className="text-xs text-zinc-400">{order.customerDetails.email}</div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-1">ID: {order._id.slice(-6).toUpperCase()}</div>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-zinc-300">
                    {formatDate(order.createdAt)}
                  </TableCell>

                  {/* Payment Method & Status */}
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      <Badge variant="outline" className={`border-0 ${
                        order.paymentMethod === 'Prepaid' 
                          ? 'bg-blue-500/10 text-blue-400' 
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {order.paymentMethod}
                      </Badge>
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${
                        order.paymentStatus === 'Paid' ? 'text-emerald-500' 
                        : order.paymentStatus === 'Failed' ? 'text-rose-500' 
                        : 'text-zinc-500'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </TableCell>

                  {/* Total Amount */}
                  <TableCell className="font-medium text-purple-400">
                    ₹{order.totalAmount}
                  </TableCell>

                  {/* Delivery Status Dropdown */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <select
                        disabled={updatingId === order._id}
                        value={order.deliveryStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`flex h-9 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                          order.deliveryStatus === 'Delivered' ? 'text-emerald-400' :
                          order.deliveryStatus === 'Shipped' ? 'text-purple-400' :
                          'text-zinc-400'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      {updatingId === order._id && <Loader2 className="w-4 h-4 animate-spin text-purple-400" />}
                    </div>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}