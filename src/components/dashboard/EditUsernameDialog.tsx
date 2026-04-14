"use client";

import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { updateUsername } from "@/lib/actions";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  username: string;
}

export function EditUsernameDialog({ username }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setError(null);

    const result = await updateUsername(formData);

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
    toast.success("Username updated successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit username</DialogTitle>
          </DialogHeader>
          <FieldGroup className="mt-6">
            <Field>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                defaultValue={username}
                required
              />
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
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
