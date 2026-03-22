"use client";

import { useState, Fragment } from "react";
import { toggleMessageStatus, deleteMessage } from "../../actions/message";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Search, MailOpen, Mail, Trash2, ChevronDown, ChevronUp, User } from "lucide-react";

export default function MessageManager({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = async (id, status) => {
    const res = await toggleMessageStatus(id, status);
    if (res.success) {
      setMessages(messages.map(m => m._id === id ? { ...m, status: status === "Unread" ? "Read" : "Unread" } : m));
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this message?")) {
      const res = await deleteMessage(id);
      if (res.success) {
        setMessages(messages.filter(m => m._id !== id));
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  return (
    <div className="space-y-6 text-zinc-50">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input placeholder="Search by name, email, or subject..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100" />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow className="border-zinc-800">
              <TableHead className="text-zinc-400">Sender</TableHead>
              <TableHead className="text-zinc-400">Subject</TableHead>
              <TableHead className="text-zinc-400">Date</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-zinc-500">No messages found.</TableCell></TableRow>
            ) : (
              filteredMessages.map((msg) => {
                const isExpanded = expandedId === msg._id;
                const isUnread = msg.status === "Unread";

                return (
                  <Fragment key={msg._id}>
                    <TableRow 
                      className={`border-zinc-800 cursor-pointer transition-colors ${isUnread ? 'bg-zinc-800/40 font-medium' : 'hover:bg-zinc-800/50'} ${isExpanded ? 'bg-zinc-800/30' : ''}`} 
                      onClick={() => setExpandedId(isExpanded ? null : msg._id)}
                    >
                      <TableCell>
                        <div className="text-zinc-100">{msg.name}</div>
                        <div className="text-xs text-zinc-400">{msg.email}</div>
                      </TableCell>
                      <TableCell className={isUnread ? "text-purple-400" : "text-zinc-300"}>{msg.subject}</TableCell>
                      <TableCell className="text-zinc-400 text-sm whitespace-nowrap">{formatDate(msg.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-0 ${isUnread ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800 text-zinc-400'}`}>
                          {msg.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleToggleStatus(msg._id, msg.status); }} title={isUnread ? "Mark as Read" : "Mark as Unread"} className="text-zinc-400 hover:text-purple-400">
                            {isUnread ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }} className="text-zinc-400 hover:text-rose-400">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="p-2 ml-2 text-zinc-500">{isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</div>
                        </div>
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow className="bg-zinc-950/50 border-zinc-800">
                        <TableCell colSpan={5} className="p-6">
                          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
                              <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400"><User className="w-5 h-5" /></div>
                              <div>
                                <h4 className="text-zinc-100 font-semibold">{msg.name}</h4>
                                <a href={`mailto:${msg.email}`} className="text-sm text-purple-400 hover:underline">{msg.email}</a>
                              </div>
                            </div>
                            <div>
                              <h5 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">Message Body</h5>
                              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                            </div>
                            {isUnread && (
                              <Button onClick={() => handleToggleStatus(msg._id, "Unread")} className="mt-6 bg-zinc-800 hover:bg-zinc-700 text-white" size="sm">
                                Mark as Read
                              </Button>
                            )}
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