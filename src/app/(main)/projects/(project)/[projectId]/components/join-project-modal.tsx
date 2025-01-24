"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { LuChevronLeft } from "react-icons/lu";
import { REGEXP_ONLY_DIGITS } from "input-otp";
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
import { useUserUserMembershipRequest } from "@/hooks/useUserQueries";
import { useUserStore } from "@/hooks/useUserStore";
import { Clock, Mail } from "lucide-react";

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
  const userId = session.data?.user?.id;

  const { isLoading: isLoadingRequests } = useUserUserMembershipRequest(userId);

  const { requests } = useUserStore();

  console.log(requests);

  const hasPendingRequest = requests.some(
    (request) => request.projectId === projectId && request.status === "PENDING"
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
      axios.post(`/api/projects/${projectId}/membership-requests`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-requests", userId] });
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
                            pattern={REGEXP_ONLY_DIGITS}
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
              {isLoadingRequests ? (
                <div className="flex justify-center">
                  <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
                </div>
              ) : hasPendingRequest ? (
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        Request Pending
                      </h3>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="flex h-2 w-2">
                          <span className="animate-ping absolute h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <p className="text-sm text-gray-500">
                          Awaiting owner or admin review
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-2" />
                      You&apos;ll receive a notification when your request is
                      approved
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-center">
                    Don&apos;t have an invitation code? You can request to join
                    this project. The project owner will review your request and
                    add you to the project.
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
                </>
              )}
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
