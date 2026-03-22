import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getMessages } from "../../actions/message";
import MessageManager from "./MessageManager";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session?.user?.role !== "admin") redirect("/admin-login");

  const messages = await getMessages();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Customer Messages</h1>
        <p className="text-zinc-500 mt-2">View and manage inquiries from your contact form.</p>
      </div>

      <MessageManager initialMessages={messages} />
    </div>
  );
}