import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { ThreadHeader } from "@/components/thread/ThreadHeader";
import { MessageComposer } from "@/components/thread/MessageComposer";
import { MessageList } from "@/components/thread/MessageList";
import { Pagination } from "@/components/pagination";
import type { MessageWithReplies } from "@/lib/types";

const MESSAGES_PER_PAGE = 5;

interface Props {
  params: Promise<{ username: string; threadId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function ThreadPage({ params, searchParams }: Props) {
  const { username, threadId } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const supabase = await createClient();
  const authUser = await getAuthUser();

  // Find the profile by username
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  // Fetch the thread
  const { data: thread } = await supabase
    .from("threads")
    .select("*")
    .eq("id", threadId)
    .eq("owner_id", profile.id)
    .single();

  if (!thread) notFound();

  // If thread is private and user is not the owner, show 404
  if (!thread.is_public && authUser?.user.id !== thread.owner_id) {
    notFound();
  }

  const isOwner = authUser?.user.id === thread.owner_id;

  // Get total message count for pagination
  const { count: totalCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("thread_id", thread.id);

  const totalPages = Math.max(1, Math.ceil((totalCount ?? 0) / MESSAGES_PER_PAGE));

  // Fetch paginated messages with replies
  const from = (currentPage - 1) * MESSAGES_PER_PAGE;
  const to = from + MESSAGES_PER_PAGE - 1;

  const { data: messages } = await supabase
    .from("messages")
    .select("*, replies(*)")
    .eq("thread_id", thread.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  const messagesWithReplies: MessageWithReplies[] = (messages ?? []).map(
    (m) => ({
      id: m.id,
      thread_id: m.thread_id,
      content: m.content,
      created_at: m.created_at,
      replies: (m.replies ?? []).sort(
        (a: { created_at: string }, b: { created_at: string }) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      ),
    }),
  );

  const basePath = `/${username}/${threadId}`;

  return (
    <div className="mx-auto max-w-xl px-6 py-8">
      <div className="flex flex-col gap-8">
        <ThreadHeader
          username={profile.username}
          threadTitle={thread.title}
        />

        <MessageComposer threadId={thread.id} isOwner={isOwner} />

        <MessageList
          messages={messagesWithReplies}
          ownerUsername={profile.username}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={basePath}
        />
      </div>
    </div>
  );
}
