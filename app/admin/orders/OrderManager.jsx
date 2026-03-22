"use client";

import { useState, Fragment } from "react";
import { updateDeliveryStatus } from "../../actions/order";
import { Input } from "../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Search, Loader2, ChevronDown, ChevronUp, MapPin, Phone, Clock, Package } from "lucide-react";

export default function OrderManager({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Track which order is expanded

  // Filter orders by customer name, email, or order ID
  const filteredOrders = orders.filter(o => 
    o.customerDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerDetails?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o._id.includes(searchQuery)
  );

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    
    const result = await updateDeliveryStatus(orderId, newStatus);
    
    if (result.success) {
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, deliveryStatus: newStatus } : order
      ));
    } else {
      alert("Failed to update status.");
    }
    
    setUpdatingId(null);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Helper to format the MongoDB timestamp to 12hr format
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  // Helper for just the date (for the collapsed view)
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
              <TableHead className="text-zinc-400">Total</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const isExpanded = expandedOrderId === order._id;

                return (
                  <Fragment key={order._id}>
                    {/* Main Row (Always Visible) */}
                    <TableRow className={`border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer ${isExpanded ? 'bg-zinc-800/30' : ''}`} onClick={() => toggleExpand(order._id)}>
                      
                      {/* Customer Details */}
                      <TableCell>
                        <div className="font-medium text-zinc-100">{order.customerDetails?.name || "Unknown"}</div>
                        <div className="text-xs text-zinc-400">{order.customerDetails?.email || "No Email"}</div>
                        <div className="text-[10px] text-purple-400/80 font-mono mt-1">ID: {order._id.slice(-8).toUpperCase()}</div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-zinc-300 whitespace-nowrap">
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
                        </div>
                      </TableCell>

                      {/* Total Amount */}
                      <TableCell className="font-medium text-purple-400 whitespace-nowrap">
                        ₹{order.totalAmount}
                      </TableCell>

                      {/* Delivery Status Dropdown */}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <select
                            disabled={updatingId === order._id}
                            value={order.deliveryStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`flex h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                              order.deliveryStatus === 'Delivered' ? 'text-emerald-400' :
                              order.deliveryStatus === 'Shipped' ? 'text-purple-400' :
                              'text-zinc-400'
                            }`}
                          >
                            <option value="Received">Received</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                          {updatingId === order._id && <Loader2 className="w-4 h-4 animate-spin text-purple-400" />}
                        </div>
                      </TableCell>

                      {/* Expand Toggle */}
                      <TableCell className="text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleExpand(order._id); }}
                          className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </TableCell>

                    </TableRow>

                    {/* Expanded Details Row */}
                    {isExpanded && (
                      <TableRow className="bg-zinc-950/50 border-zinc-800 hover:bg-zinc-950/50">
                        <TableCell colSpan={6} className="p-0">
                          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-zinc-800 animate-in slide-in-from-top-2 duration-200">
                            
                            {/* Left Column: Profile & Address */}
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-3 flex items-center">
                                  <Clock className="w-4 h-4 mr-2" /> Order Timestamp
                                </h4>
                                <p className="text-zinc-300 font-medium">{formatDateTime(order.createdAt)}</p>
                              </div>

                              <div>
                                <h4 className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-3 flex items-center">
                                  <Phone className="w-4 h-4 mr-2" /> Contact Info
                                </h4>
                                <p className="text-zinc-300 font-medium">{order.customerDetails?.phone || "No phone provided"}</p>
                                <p className="text-zinc-400 text-sm mt-1">{order.customerDetails?.email}</p>
                              </div>

                              <div>
                                <h4 className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-3 flex items-center">
                                  <MapPin className="w-4 h-4 mr-2" /> Shipping Address
                                </h4>
                                <p className="text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50">
                                  {order.customerDetails?.address || "No address provided"}
                                </p>
                              </div>
                            </div>

                            {/* Right Column: Order Items */}
                            <div>
                              <h4 className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-3 flex items-center">
                                <Package className="w-4 h-4 mr-2" /> Items Purchased
                              </h4>
                              <div className="space-y-3 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50">
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center py-2 border-b border-zinc-800/50 last:border-0 last:pb-0">
                                    <div className="flex-1 pr-4">
                                      <p className="text-zinc-200 font-medium line-clamp-1">{item.name}</p>
                                      <p className="text-xs text-zinc-500 mt-0.5">Qty: {item.quantity} × ₹{item.price}</p>
                                    </div>
                                    <div className="font-semibold text-purple-400 whitespace-nowrap">
                                      ₹{item.price * item.quantity}
                                    </div>
                                  </div>
                                ))}
                                <div className="flex justify-between items-center pt-3 mt-3 border-t border-zinc-700">
                                  <span className="text-zinc-400 font-medium">Grand Total</span>
                                  <span className="text-lg font-bold text-emerald-400">₹{order.totalAmount}</span>
                                </div>
                              </div>
                            </div>

                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}