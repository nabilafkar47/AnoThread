import { EditUsernameDialog } from "@/components/dashboard/EditUsernameDialog";
import { CreateThreadDialog } from "@/components/dashboard/CreateThreadDialog";
import { ThreadCard } from "@/components/dashboard/ThreadCard";
import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ThreadCardData } from "@/lib/types";
import { Pagination } from "@/components/pagination";

const THREADS_PER_PAGE = 6;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const authUser = await getAuthUser();

  if (!authUser) {
    redirect("/login");
  }

  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const supabase = await createClient();

  // Get total count for pagination
  const { count: totalCount } = await supabase
    .from("threads")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", authUser.user.id);

  const totalPages = Math.max(1, Math.ceil((totalCount ?? 0) / THREADS_PER_PAGE));

  // Fetch paginated threads
  const from = (currentPage - 1) * THREADS_PER_PAGE;
  const to = from + THREADS_PER_PAGE - 1;

  const { data: threads } = await supabase
    .from("threads")
    .select("*, messages(count)")
    .eq("owner_id", authUser.user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  const threadCards: ThreadCardData[] = (threads ?? []).map((t) => ({
    id: t.id,
    owner_id: t.owner_id,
    title: t.title,
    is_public: t.is_public,
    created_at: t.created_at,
    updated_at: t.updated_at,
    owner_username: authUser.profile.username,
    message_count: (t.messages as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
      <div className="flex gap-1 items-center">
        <h2 className="text-xl tracking-tight">
          Halo,{" "}
          <span className="tracking-tight font-semibold">
            {authUser.profile.username}
          </span>
          !
        </h2>
        <EditUsernameDialog username={authUser.profile.username} />
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">Threads</h2>
        <CreateThreadDialog />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {threadCards.length === 0 ? (
          <p className="text-muted-foreground text-sm col-span-full text-center py-8">
            No threads yet. Create your first one!
          </p>
        ) : (
          threadCards.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/dashboard"
      />
    </div>
  );
}
