"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { createReply } from "@/lib/actions";
import { toast } from "sonner";

interface Props {
  messageId: string;
}

export function ReplyComposer({ messageId }: Props) {
  const [value, setValue] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSend = async () => {
    if (!value.trim()) return;
    setIsPending(true);

    const result = await createReply(messageId, value);

    if (result?.error) {
      toast.error(result.error);
    } else {
      setValue("");
      toast.success("Reply sent!");
    }

    setIsPending(false);
  };

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Reply"
        value={value}
        required
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <Button size="icon" onClick={handleSend} disabled={isPending}>
        <Send />
      </Button>
    </div>
  );
}
