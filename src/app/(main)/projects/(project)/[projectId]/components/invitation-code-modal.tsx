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
        className="w-full max-w-md lg:max-w-xl"
        onInteractOutside={(e) => e.preventDefault()}
        hideCloseButton={true}>
        <DialogHeader>
          <DialogTitle>Enter Invitation Code</DialogTitle>
          <DialogDescription>
            Please enter the 8-character invitation code to join this project.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-4">
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
                        {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot
                            className="w-12 h-12 text-2xl"
                            index={0}
                          />
                          <InputOTPSlot
                            className="w-12 h-12 text-2xl"
                            index={1}
                          />
                          <InputOTPSlot
                            className="w-12 h-12 text-2xl"
                            index={2}
                          />
                          <InputOTPSlot
                            className="w-12 h-12 text-2xl"
                            index={3}
                          />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot
                            className="w-12 h-12 text-2xl"
                            index={4}
                          />
                          <InputOTPSlot
                            className="w-12 h-12 text-2xl"
                            index={5}
                          />
                          <InputOTPSlot
                            className="w-12 h-12 text-2xl"
                            index={6}
                          />
                          <InputOTPSlot
                            className="w-12 h-12 text-2xl"
                            index={7}
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="justify-between">
              <Link href="/projects">
                <Button variant="outline" className="flex items-center gap-1">
                  <LuChevronLeft className="h-5 w-5" />
                  Go back
                </Button>
              </Link>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isPending}>
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
