import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { PhoneCall, Video, Clock, Sparkles, MessageCircle, CalendarHeart } from "lucide-react";

// --- NEW: SEO Metadata ---
export const metadata = {
  title: "Tarot & Astrology Readings | ShivShakkti Tarot",
  description: "Book personalized voice and video tarot readings. Gain clarity, uncover hidden truths, and align with your cosmic path.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-20 px-6 lg:px-12 text-zinc-50">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.1em] text-zinc-100 uppercase">
            Astro & Tarot <span className="text-purple-500">Readings</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Gain clarity, uncover hidden truths, and align with your cosmic path. Book a one-on-one personalized reading with ShivShakkti Tarot.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          
          {/* Voice Call Card */}
          <Card className="bg-zinc-900 border-zinc-800 hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <PhoneCall className="w-32 h-32 text-purple-500" />
            </div>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 mb-4">
                <PhoneCall className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl text-zinc-100 font-serif tracking-wide">Voice Call Reading</CardTitle>
              <p className="text-zinc-400 text-sm mt-2">A deep dive into your energies through a guided voice session.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-zinc-500" />
                    <span className="font-medium text-zinc-300">45 Minutes</span>
                  </div>
                  <span className="text-xl font-bold text-emerald-400">₹1,999</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-purple-500/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none" />
                  <div className="flex items-center gap-3 relative z-10">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-zinc-100">1 Hour</span>
                  </div>
                  <span className="text-xl font-bold text-emerald-400 relative z-10">₹2,400</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Call Card */}
          <Card className="bg-zinc-900 border-zinc-800 hover:border-pink-500/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Video className="w-32 h-32 text-pink-500" />
            </div>
            <CardHeader>
              <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-400 mb-4">
                <Video className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl text-zinc-100 font-serif tracking-wide">Video Call Reading</CardTitle>
              <p className="text-zinc-400 text-sm mt-2">Face-to-face connection for a more immersive and visual tarot experience.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-zinc-500" />
                    <span className="font-medium text-zinc-300">45 Minutes</span>
                  </div>
                  <span className="text-xl font-bold text-emerald-400">₹2,800</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-pink-500/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent pointer-events-none" />
                  <div className="flex items-center gap-3 relative z-10">
                    <Clock className="w-5 h-5 text-pink-400" />
                    <span className="font-medium text-zinc-100">1 Hour</span>
                  </div>
                  <span className="text-xl font-bold text-emerald-400 relative z-10">₹3,500</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Booking & Timings Information */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-zinc-950 -z-10" />
          
          <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-zinc-100 mb-6">How to Book Your Session</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10 text-zinc-300">
            <div className="flex items-center gap-3 bg-zinc-950 px-6 py-4 rounded-xl border border-zinc-800">
              <CalendarHeart className="w-6 h-6 text-purple-400" />
              <div className="text-left">
                <p className="text-sm text-zinc-500 font-medium">Available Days</p>
                <p className="font-semibold">Monday - Saturday</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-zinc-950 px-6 py-4 rounded-xl border border-zinc-800">
              <Clock className="w-6 h-6 text-purple-400" />
              <div className="text-left">
                <p className="text-sm text-zinc-500 font-medium">Available Timings</p>
                <p className="font-semibold">11:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>

          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Readings are strictly by appointment only. Please contact us via WhatsApp or Phone to confirm slot availability and secure your booking.
          </p>

          {/* ⚠️ UPDATE THIS PHONE NUMBER ⚠️ */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto h-14 px-8 text-lg rounded-full shadow-lg shadow-emerald-900/20 gap-3">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </Button>
            </a>
            
            <a href="tel:+919211929837">
              <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white w-full sm:w-auto h-14 px-8 text-lg rounded-full gap-3">
                <PhoneCall className="w-5 h-5" />
                +91 92119 29837
              </Button>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}