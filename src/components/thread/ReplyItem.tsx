import type { Reply } from "@/lib/types";

interface Props {
  reply: Reply;
  ownerUsername: string;
}

export function ReplyItem({ reply, ownerUsername }: Props) {
  return (
    <div className="flex w-full bg-foreground/5 p-3 rounded-lg">
      <p className="text-muted-foreground">
        {reply.content}
        {reply.is_owner && (
          <>
            {"  "}
            <span className="text-blue-500">{ownerUsername}</span>
          </>
        )}
      </p>
    </div>
  );
}
