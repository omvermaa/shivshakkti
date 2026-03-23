"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitMessage } from "../actions/message";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Mail, Instagram, Send, Loader2 } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await submitMessage(formData);

    if (res.success) {
      router.push("/contact/success");
    } else {
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-20 px-6 lg:px-12 text-zinc-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-serif tracking-[0.1em] text-zinc-100 uppercase">
            Get in <span className="text-purple-500">Touch</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Have a question about a reading, an order, or a specific crystal? We are here to help guide you. Send us a message and our energies will align shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <a href="https://www.instagram.com/shivshakktitarot/" target="_blank" rel="noopener noreferrer">
              <Card className="bg-zinc-900/50 border-zinc-800 hover:border-purple-500/50 transition-colors group cursor-pointer mb-6">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">Instagram</h3>
                    <p className="text-sm text-zinc-400 mt-1">@shivshakktitarot</p>
                  </div>
                </CardContent>
              </Card>
            </a>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">Email Us</h3>
                  <p className="text-sm text-zinc-400 mt-1">hello@shivshakktitarot.com</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-zinc-300">Your Name</Label>
                      <Input id="name" name="name" required className="bg-zinc-950 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                      <Input id="email" name="email" type="email" required className="bg-zinc-950 border-zinc-800" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-zinc-300">Subject</Label>
                    <select id="subject" name="subject" required defaultValue="" className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50">
                      <option value="" disabled>Select an inquiry type</option>
                      <option value="Order Support">Order Support</option>
                      <option value="Tarot Reading Inquiry">Tarot Reading Inquiry</option>
                      <option value="Product Question">Product Question</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-zinc-300">Your Message</Label>
                    <Textarea id="message" name="message" required rows={5} placeholder="How can we help you today?" className="bg-zinc-950 border-zinc-800 resize-none" />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-md">
                    {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</> : <><Send className="w-5 h-5 mr-2" /> Send Message</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}