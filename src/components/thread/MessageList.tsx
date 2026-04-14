import type { MessageWithReplies } from "@/lib/types";
import { MessageCard } from "./MessageCard";

interface Props {
  messages: MessageWithReplies[];
  ownerUsername: string;
}

export function MessageList({ messages, ownerUsername }: Props) {
  if (messages.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No messages yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {messages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          ownerUsername={ownerUsername}
        />
      ))}
    </div>
  );
}
