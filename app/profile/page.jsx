import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getUserProfile } from "../actions/user";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  // 1. Double check authentication (Server-side security)
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/user-login");
  }

  // 2. Fetch their existing data to pre-fill the form
  const res = await getUserProfile();
  const user = res.success ? res.user : null;

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-12 px-6 lg:px-12 text-zinc-50">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">My Profile</h1>
          <p className="text-zinc-400 mt-2">Manage your personal information and delivery address.</p>
        </div>
        
        {/* Pass the data into our interactive client form */}
        <ProfileForm initialData={user} />
      </div>
    </div>
  );
}