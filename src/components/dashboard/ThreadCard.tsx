"use client";

import { Check, LinkIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { ThreadCardMenu } from "./ThreadCardMenu";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { useState } from "react";
import type { ThreadCardData } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  thread: ThreadCardData;
}

export function ThreadCard({ thread }: Props) {
  const [isPublic, setIsPublic] = useState(thread.is_public);
  const [copied, setCopied] = useState(false);

  const threadHref = `/${thread.owner_username}/${thread.id}`;

  const handleCopyLink = () => {
    const url = `${window.location.origin}${threadHref}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const createdAt = new Date(thread.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card size="default" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 min-w-0">
          <h3 className="truncate">{thread.title}</h3>
          <ThreadCardMenu
            threadId={thread.id}
            isPublic={isPublic}
            onVisibilityChange={setIsPublic}
          />
        </CardTitle>
        <CardDescription>{createdAt}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Badge variant={thread.message_count > 0 ? "success" : "secondary"}>
          {thread.message_count} messages
        </Badge>
        <Badge variant={isPublic ? "info" : "destructive"}>
          {isPublic ? "Public" : "Private"}
        </Badge>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="default" size="sm" className="flex-1" asChild>
          <Link href={threadHref}>View</Link>
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleCopyLink}
        >
          {copied ? <Check/> : <LinkIcon />}
        </Button>
      </CardFooter>
    </Card>
  );
}
