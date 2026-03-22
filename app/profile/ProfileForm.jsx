"use client";

import { useState } from "react";
import { updateProfile } from "../actions/user";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Loader2, CheckCircle2, MapPin, User, LocateFixed } from "lucide-react";

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", 
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", 
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", 
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function ProfileForm({ initialData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    street: initialData?.address?.street || "",
    city: initialData?.address?.city || "",
    state: initialData?.address?.state || "",
    zipCode: initialData?.address?.zipCode || "",
    country: initialData?.address?.country || "India",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") value = value.replace(/\D/g, "").slice(0, 10);
    else if (name === "zipCode") value = value.replace(/\D/g, "").slice(0, 6);
    setFormData({ ...formData, [name]: value });
  };

  // --- NEW: Autofill Location Handler ---
  const handleAutofillLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Free reverse geocoding via OpenStreetMap
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          if (data && data.address) {
            const addr = data.address;
            const fetchedCity = addr.city || addr.town || addr.village || addr.state_district || "";
            const fetchedZip = addr.postcode ? addr.postcode.replace(/\D/g, "").slice(0, 6) : "";
            
            // Normalize State (Nominatim sometimes returns "NCT of Delhi" instead of "Delhi")
            let fetchedState = addr.state || "";
            if (fetchedState.includes("Delhi")) fetchedState = "Delhi";
            
            // Match exactly with our array to ensure the dropdown works
            const matchedState = indianStates.find(s => s.toLowerCase() === fetchedState.toLowerCase()) || "";

            setFormData(prev => ({
              ...prev,
              city: fetchedCity || prev.city,
              state: matchedState || prev.state,
              zipCode: fetchedZip || prev.zipCode,
            }));
          }
        } catch (error) {
          alert("Failed to fetch address details. Please fill manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        alert("Location access denied or unavailable. Please fill manually.");
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) return alert("Please enter a valid 10-digit phone number.");
    if (formData.zipCode.length !== 6) return alert("Please enter a valid 6-digit ZIP/PIN code.");

    setIsLoading(true);
    setSuccessMessage("");

    const res = await updateProfile(formData);
    
    if (res.success) {
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000); 
    } else {
      alert("Failed to update profile: " + res.error);
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center text-zinc-100">
            <User className="w-5 h-5 mr-2 text-purple-400" />
            Personal Details
          </CardTitle>
          <CardDescription className="text-zinc-400">Your basic account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="bg-zinc-950 border-zinc-800 text-zinc-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-300">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" inputMode="numeric" value={formData.phone} onChange={handleChange} required className="bg-zinc-950 border-zinc-800 text-zinc-100" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center text-zinc-100">
              <MapPin className="w-5 h-5 mr-2 text-purple-400" />
              Delivery Address
            </CardTitle>
            <CardDescription className="text-zinc-400 mt-1">Where should we send your mystical items?</CardDescription>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAutofillLocation}
            disabled={isLocating}
            className="border-zinc-700 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs h-9"
          >
            {isLocating ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <LocateFixed className="w-3.5 h-3.5 mr-2 text-purple-400" />}
            Auto-fill Location
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street" className="text-zinc-300">Street Address</Label>
            <Input id="street" name="street" value={formData.street} onChange={handleChange} required className="bg-zinc-950 border-zinc-800 text-zinc-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-zinc-300">City</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} required className="bg-zinc-950 border-zinc-800 text-zinc-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-zinc-300">State / Province</Label>
              <select id="state" name="state" value={formData.state} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50">
                <option value="" disabled>Select a state</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-zinc-300">ZIP / PIN Code</Label>
              <Input id="zipCode" name="zipCode" type="text" inputMode="numeric" value={formData.zipCode} onChange={handleChange} required className="bg-zinc-950 border-zinc-800 text-zinc-100" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-4 pt-4">
        {successMessage && <span className="text-sm text-emerald-400 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" />{successMessage}</span>}
        <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white min-w-[140px]">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
        </Button>
      </div>

    </form>
  );
}