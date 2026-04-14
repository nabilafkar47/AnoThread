"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { createMessage } from "@/lib/actions";
import { toast } from "sonner";

interface Props {
  threadId: string;
  isOwner: boolean;
}

export function MessageComposer({ threadId, isOwner }: Props) {
  const [value, setValue] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleSend = async () => {
    if (!value.trim()) return;
    setIsPending(true);

    const result = await createMessage(threadId, value);

    if (result?.error) {
      toast.error(result.error);
    } else {
      setValue("");
      toast.success("Message sent!");
    }

    setIsPending(false);
  };

  if (isOwner) {
    return (
      <Button variant="outline" onClick={handleCopy}>
        Copy your link
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        placeholder="Type your message..."
        value={value}
        required
        onChange={(e) => setValue(e.target.value)}
      />
      <Button onClick={handleSend} disabled={isPending}>
        {isPending ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}
