import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { LuChevronLeft } from "react-icons/lu";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
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
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";

interface JoinProjectProps {
  projectId: string;
}

const joinProjectSchema = z.object({
  code: z.string().min(8, {
    message: "Your one-time password must be 8 characters.",
  }),
});

export default function JoinProjectModal({ projectId }: JoinProjectProps) {
  const [isDialogOpen, setDialogOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("code");
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useSession();

  const { data: userRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["user-requests"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/users/${session.data?.user?.id}/membership-requests`
      );
      return response.data;
    },
  });

  const hasPendingRequest = userRequests?.some(
    (request: any) =>
      request.projectId === projectId && request.status === "PENDING"
  );

  const form = useForm<z.infer<typeof joinProjectSchema>>({
    resolver: zodResolver(joinProjectSchema),
  });

  const toggleDialog = () => setDialogOpen(!isDialogOpen);

  const { mutate: joinWithCode, isPending: isJoiningWithCode } = useMutation({
    mutationFn: (data: z.infer<typeof joinProjectSchema>) =>
      axios.post(`/api/projects/${projectId}/join`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
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

  const { mutate: sendRequest, isPending: isSendingRequest } = useMutation({
    mutationFn: () =>
      axios.post(`/api/projects/${projectId}/membership-request`),
    onSuccess: () => {
      toast.success("Membership request sent successfully.");
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.message || "Failed to send membership request"
        );
      } else {
        toast.error("Failed to send membership request");
      }
    },
  });

  const onSubmit = async (data: z.infer<typeof joinProjectSchema>) => {
    joinWithCode(data);
  };

  const handleSendRequest = () => {
    sendRequest();
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
      <DialogContent
        className="w-[95vw] max-w-md lg:max-w-xl p-4 sm:p-6"
        onInteractOutside={(e) => e.preventDefault()}
        hideCloseButton={true}>
        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className="text-xl sm:text-2xl">
            Join Project
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Enter an invitation code or request membership to join this project.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code">Have a code</TabsTrigger>
            <TabsTrigger value="request">Request Membership</TabsTrigger>
          </TabsList>
          <TabsContent value="code">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 mt-4">
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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isJoiningWithCode}>
                  {isJoiningWithCode ? (
                    <>
                      <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Join Project"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="request">
            <div className="space-y-4 mt-4">
              <p className="text-sm text-center">
                Don&apos;t have an invitation code? You can request to join this
                project. The project owner will review your request and add you
                to the project.
              </p>
              <Button
                onClick={handleSendRequest}
                className="w-full"
                disabled={isSendingRequest}>
                {isSendingRequest ? (
                  <>
                    <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                    Sending request...
                  </>
                ) : (
                  "Send Membership Request"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Link href="/projects" className="w-full">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-1">
              <LuChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              Go back to projects
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
