"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  Mail,
  ArrowLeft,
  KeyRound,
  UserPlus,
  Loader2,
} from "lucide-react";
import type { Session } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tryCatch } from "@/lib/try-catch";
import { toast } from "sonner";
import { joinWithCode } from "@/server/api/project/join";
import { createMembershipRequest } from "@/server/api/project/members";

interface JoinProjectProps {
  projectId: string;
  session: Session;
  hasPendingRequest: boolean;
}

const joinProjectSchema = z.object({
  code: z.string().min(8, {
    message: "Your invitation code must be 8 digits.",
  }),
});

export default function JoinProjectModal({
  projectId,
  session,
  hasPendingRequest,
}: JoinProjectProps) {
  const [isDialogOpen, setDialogOpen] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("code");
  const router = useRouter();

  const form = useForm<z.infer<typeof joinProjectSchema>>({
    resolver: zodResolver(joinProjectSchema),
  });

  const toggleDialog = () => setDialogOpen(!isDialogOpen);

  const onSubmit = async (values: z.infer<typeof joinProjectSchema>) => {
    startTransition(async () => {
      const { data, error: joinWithCodeError } = await tryCatch(
        joinWithCode(values.code)
      );

      if (joinWithCodeError) {
        toast.error(joinWithCodeError.message);
        return;
      }

      if (data.success === true) {
        toast.success("You've successfully joined the project.");
        toggleDialog();
        router.refresh();
      }
    });
  };

  const handleSendRequest = async () => {
    startTransition(async () => {
      const { data, error: createRequestError } = await tryCatch(
        createMembershipRequest(projectId)
      );

      if (createRequestError) {
        toast.error(createRequestError.message);
        return;
      }

      if (data.success === true) {
        toast.success("Membership request sent successfully!");
      }
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
      <DialogContent
        className="w-[95vw] max-w-md lg:max-w-xl p-0 overflow-hidden rounded-xl shadow-lg"
        onInteractOutside={(e) => e.preventDefault()}>
        <div className="bg-primary p-6 text-white">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Join Project
            </DialogTitle>
            <DialogDescription className="text-primary-100">
              Enter an invitation code or request access to join this
              collaborative space
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="code" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                <span>Join with Code</span>
              </TabsTrigger>
              <TabsTrigger value="request" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Request Access</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code">
              <Card>
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6">
                      <div>
                        <Badge
                          variant="outline"
                          className="mb-4 bg-primary-50 text-primary-700 border-primary-200">
                          Enter your 8-digit invitation code
                        </Badge>

                        <FormField
                          control={form.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex justify-center">
                                  <InputOTP
                                    maxLength={8}
                                    pattern={REGEXP_ONLY_DIGITS}
                                    {...field}>
                                    <InputOTPGroup>
                                      {[0, 1, 2, 3].map((index) => (
                                        <InputOTPSlot
                                          key={index}
                                          className="w-12 h-14 text-2xl border-primary-200 focus:border-primary-500"
                                          index={index}
                                        />
                                      ))}
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                      {[4, 5, 6, 7].map((index) => (
                                        <InputOTPSlot
                                          key={index}
                                          className="w-12 h-14 text-2xl border-primary-200 focus:border-primary-500"
                                          index={index}
                                        />
                                      ))}
                                    </InputOTPGroup>
                                  </InputOTP>
                                </div>
                              </FormControl>
                              <FormMessage className="text-center mt-2" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isPending}>
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Joining Project...
                          </>
                        ) : (
                          "Join Project"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="request">
              <ScrollArea className="h-[250px]">
                <Card className="border-0 shadow-none">
                  <CardContent className="pt-4">
                    {isPending ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-gray-600">
                          Processing your request...
                        </p>
                      </div>
                    ) : hasPendingRequest ? (
                      <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary-100 p-3 rounded-full">
                            <Clock className="h-6 w-6 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">
                              Request Pending
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Your request to join this project is currently
                              under review by the project administrators.
                            </p>

                            <div className="flex items-center gap-2 text-sm bg-white p-3 rounded-md border border-gray-100">
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                              </span>
                              <span className="font-medium text-gray-700">
                                Awaiting Response
                              </span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-primary-100 flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2 text-primary-500" />
                              You&apos;ll be notified when your request is
                              approved
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                          <p className="text-amber-800 text-sm">
                            Don&apos;t have an invitation code? Request to join
                            this project and the project owner will review your
                            application.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">
                            What happens next?
                          </h4>
                          <div className="grid gap-3">
                            <div className="flex items-start gap-3">
                              <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                                1
                              </div>
                              <p className="text-gray-600 text-sm">
                                Your request will be sent to the project
                                administrators
                              </p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                                2
                              </div>
                              <p className="text-gray-600 text-sm">
                                You&apos;ll receive a notification when your
                                request is approved
                              </p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                                3
                              </div>
                              <p className="text-gray-600 text-sm">
                                Once approved, you&apos;ll gain access to the
                                project workspace
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handleSendRequest}
                          className="w-full"
                          size="lg"
                          disabled={isPending}>
                          Send Membership Request
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="px-6 pb-6">
          <Link href="/projects" className="w-full">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-gray-200 hover:bg-gray-50"
              size="lg">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
