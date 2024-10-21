import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuChevronLeft } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface InvitationCodeProps {
  projectId: string;
}

const invitationCodeSchema = z.object({
  code: z.string().min(8, {
    message: "Your one-time password must be 8 characters.",
  }),
});

export default function InvitationCodeModal({
  projectId,
}: InvitationCodeProps) {
  const [isDialogOpen, setDialogOpen] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof invitationCodeSchema>>({
    resolver: zodResolver(invitationCodeSchema),
  });

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: z.infer<typeof invitationCodeSchema>) =>
      axios.post(`/api/projects/${projectId}/join`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
      toast.success("You've successfully joined the project.");
      toggleDialog();
      router.refresh();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to join project");
      } else {
        toast.error("Failed to join project");
      }
    },
  });

  const onSubmit = async (data: z.infer<typeof invitationCodeSchema>) => {
    mutate(data);
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
    <DialogContent
      className="w-[95vw] max-w-md lg:max-w-xl p-4 sm:p-6"
      onInteractOutside={(e) => e.preventDefault()}
      hideCloseButton={true}
    >
      <DialogHeader className="space-y-2 text-center">
        <DialogTitle className="text-xl sm:text-2xl">Enter Invitation Code</DialogTitle>
        <DialogDescription className="text-sm sm:text-base">
          Please enter the 8-character invitation code to join this project.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="flex justify-center">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={8}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      {...field}
                    >
                      <InputOTPGroup>
                        {[0, 1, 2, 3].map((index) => (
                          <InputOTPSlot
                            key={index}
                            className="w-8 h-10 sm:w-12 sm:h-12 text-lg sm:text-2xl"
                            index={index}
                          />
                        ))}
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        {[4, 5, 6, 7].map((index) => (
                          <InputOTPSlot
                            key={index}
                            className="w-8 h-10 sm:w-12 sm:h-12 text-lg sm:text-2xl"
                            index={index}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
            <Link href="/projects" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-1">
                <LuChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                Go back
              </Button>
            </Link>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
  );
}
