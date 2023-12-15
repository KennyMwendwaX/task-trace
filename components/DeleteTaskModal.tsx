import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "@radix-ui/react-icons";

export default function DeleteTaskModal() {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center cursor-pointer">
            <TrashIcon className="text-red-500 mr-1 w-4 h-4" />
            Delete
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription> */}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
