"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldDescription, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createThread } from "@/lib/actions";
import { useState } from "react";
import { toast } from "sonner";
import { LinkIcon, Check } from "lucide-react";

export function CreateThreadDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Share link dialog state
  const [shareOpen, setShareOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setError(null);

    const result = await createThread(formData);

    if ("error" in result) {
      const err = result.error;
      let firstError = "Something went wrong";
      if (typeof err === "string") {
        firstError = err;
      } else if (err) {
        const values = Object.values(err).flat().filter(Boolean);
        if (values.length > 0) firstError = values[0] as string;
      }
      setError(firstError);
      setIsPending(false);
      return;
    }

    setIsPending(false);
    setOpen(false);
    toast.success("Thread created successfully!");

    // Show share link dialog
    if ("threadId" in result && "ownerUsername" in result) {
      const url = `${window.location.origin}/${result.ownerUsername}/${result.threadId}`;
      setShareLink(url);
      setLinkCopied(false);
      setShareOpen(true);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            Create
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form action={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create thread</DialogTitle>
            </DialogHeader>
            <FieldGroup className="mt-6">
              <Field>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: ask me a question"
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="visibility">Visibility</Label>
                <Select name="visibility" defaultValue="public">
                  <SelectTrigger id="visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Visibility</SelectLabel>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Set to public to allow sharing with others.
                </FieldDescription>
              </Field>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </FieldGroup>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Share Link Dialog — shown after successful creation */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Thread created!</DialogTitle>
            <DialogDescription>
              Share this link to let anyone send you anonymous messages.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              readOnly
              value={shareLink}
              className="flex-1 text-sm"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              size="icon"
              variant={linkCopied ? "default" : "outline"}
              onClick={handleCopyShareLink}
            >
              {linkCopied ? <Check /> : <LinkIcon />}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
