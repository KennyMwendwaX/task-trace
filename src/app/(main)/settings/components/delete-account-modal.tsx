"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransition } from "react";
import { deleteUserAccount } from "@/server/actions/user/delete";
import { Session } from "@/lib/auth";
import { tryCatch } from "@/lib/try-catch";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function DeleteAccountModal({ session }: { session: Session }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    startTransition(async () => {
      const { data: result, error: deleteAccountError } = await tryCatch(
        deleteUserAccount(session.user.id)
      );

      if (deleteAccountError) {
        toast.error(deleteAccountError.message);
      }

      if (result?.success) {
        signOut({
          fetchOptions: {
            onSuccess: () => {
              router.replace("/sign-in");
            },
          },
        });
        toast.success("Account deleted successfully");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-red-500">
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>
            Are you sure you want to delete your account?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. You will lose all access to this
            project.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteAccount}
            disabled={isPending}>
            {isPending ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
