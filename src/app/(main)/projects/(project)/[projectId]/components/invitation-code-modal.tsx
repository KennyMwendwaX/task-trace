import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function InvitationCodeModal() {
  const [isDialogOpen, setDialogOpen] = useState(true);

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  const onSubmit = async (code: string) => {};
  return (
    <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
      <DialogContent
        className="w-full max-w-lg sm:max-w-2xl"
        hideCloseButton={true}
        onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Enter Invitation Code</DialogTitle>
          <DialogDescription>
            Please enter the invitation code to access this project.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <DialogFooter className="sm:justify-end">
            <Button type="submit" className="w-full sm:w-auto">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

{
  /* <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isPending}>
                {isPending ? (
                  <>
                    <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button> */
}
