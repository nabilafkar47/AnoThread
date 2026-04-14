import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MessageWithReplies } from "@/lib/types";
import { ReplyComposer } from "./ReplyComposer";
import { ReplyItem } from "./ReplyItem";

interface Props {
  message: MessageWithReplies;
  ownerUsername: string;
}

export function MessageCard({ message, ownerUsername }: Props) {
  return (
    <Card size="default" className="w-full">
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>
      </CardHeader>

      {/* Anyone can reply — no isOwner check */}
      <CardContent>
        <ReplyComposer messageId={message.id} />
      </CardContent>

      {message.replies.length > 0 && (
        <CardFooter className="flex flex-col gap-2">
          {message.replies.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              ownerUsername={ownerUsername}
            />
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
