"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Validation Schemas ─────────────────────────────────────

const CreateThreadSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  visibility: z.enum(["public", "private"]),
});

const UpdateUsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username is too long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
});

const MessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long"),
});

const ReplySchema = z.object({
  content: z
    .string()
    .min(1, "Reply cannot be empty")
    .max(500, "Reply is too long"),
});

// ─── Thread Actions ─────────────────────────────────────────

export async function createThread(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = CreateThreadSchema.safeParse({
    title: formData.get("title"),
    visibility: formData.get("visibility") ?? "public",
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { data: thread, error } = await supabase
    .from("threads")
    .insert({
      owner_id: user.id,
      title: parsed.data.title,
      is_public: parsed.data.visibility === "public",
    })
    .select("id")
    .single();

  if (error || !thread) {
    return { error: { title: [error?.message ?? "Failed to create thread"] } };
  }

  // Get the owner's username for the share link
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  revalidatePath("/dashboard");
  return {
    success: true,
    threadId: thread.id as string,
    ownerUsername: profile?.username as string,
  };
}

export async function deleteThread(threadId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Verify ownership via RLS — if not owner, this won't delete anything
  const { error } = await supabase
    .from("threads")
    .delete()
    .eq("id", threadId)
    .eq("owner_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleThreadVisibility(
  threadId: string,
  isPublic: boolean,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("threads")
    .update({ is_public: isPublic })
    .eq("id", threadId)
    .eq("owner_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

// ─── Message Actions ────────────────────────────────────────

export async function createMessage(threadId: string, content: string) {
  const supabase = await createClient();

  const parsed = MessageSchema.safeParse({ content });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.content?.[0] };
  }

  const { error } = await supabase.from("messages").insert({
    thread_id: threadId,
    content: parsed.data.content,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/[username]/[threadId]", "page");
  return { success: true };
}

// ─── Reply Actions ──────────────────────────────────────────

export async function createReply(messageId: string, content: string) {
  const supabase = await createClient();

  const parsed = ReplySchema.safeParse({ content });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.content?.[0] };
  }

  // Determine if the current user is the thread owner
  let isOwner = false;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: message } = await supabase
      .from("messages")
      .select("thread_id, threads(owner_id)")
      .eq("id", messageId)
      .single();

    if (message && (message.threads as unknown as { owner_id: string } | null)?.owner_id === user.id) {
      isOwner = true;
    }
  }

  const { error } = await supabase.from("replies").insert({
    message_id: messageId,
    content: parsed.data.content,
    is_owner: isOwner,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/[username]/[threadId]", "page");
  return { success: true };
}

// ─── Profile Actions ────────────────────────────────────────

export async function updateUsername(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = UpdateUsernameSchema.safeParse({
    username: formData.get("username"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Check if username is already taken by someone else
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", parsed.data.username)
    .neq("id", user.id)
    .single();

  if (existing) {
    return { error: { username: ["Username is already taken"] } };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username: parsed.data.username, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return { error: { username: [error.message] } };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
