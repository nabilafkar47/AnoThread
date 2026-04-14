"use client";

import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { deleteThread, toggleThreadVisibility } from "@/lib/actions";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  threadId: string;
  isPublic: boolean;
  onVisibilityChange: (value: boolean) => void;
}

export function ThreadCardMenu({
  threadId,
  isPublic,
  onVisibilityChange,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleVisibilityChange = async (checked: boolean) => {
    onVisibilityChange(checked);
    const result = await toggleThreadVisibility(threadId, checked);

    if ("error" in result) {
      // Revert on error
      onVisibilityChange(!checked);
      toast.error("Failed to update visibility");
    } else {
      toast.success(
        checked ? "Thread is now public" : "Thread is now private",
      );
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteThread(threadId);

    if ("error" in result) {
      toast.error("Failed to delete thread");
    } else {
      toast.success("Thread deleted successfully");
    }

    setIsDeleting(false);
    setConfirmOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuCheckboxItem
              checked={isPublic}
              onCheckedChange={handleVisibilityChange}
            >
              Public
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setConfirmOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete thread?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All messages and replies in this
              thread will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
