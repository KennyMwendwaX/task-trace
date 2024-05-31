"use client";

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuUserPlus2 } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const invitationCodeSchema = z.object({
  code: z
    .string()
    .length(10, { message: "Invitation code must be 10 characters." }),
});

type InvitationCode = z.infer<typeof invitationCodeSchema>;

export default function JoinProjectModal() {
  const form = useForm<z.infer<typeof invitationCodeSchema>>({
    resolver: zodResolver(invitationCodeSchema),
  });

  const [isDialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  const {
    mutate: joinProject,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (values: InvitationCode) => {
      const options = {
        method: "POST",
        body: JSON.stringify(values),
      };
      const response = await fetch("/api/projects/join", options);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      const { projectId } = data;
      router.push(`/projects/${projectId}`);
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
      toggleDialog();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function onSubmit(values: InvitationCode) {
    joinProject(values);
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="gap-1">
            <LuUserPlus2 className="w-5 h-5" />
            <span>Join Project</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Join Project</DialogTitle>
            <DialogDescription>
              Enter the invitation code you received to join the project.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex w-full items-end space-x-2">
                <div className="flex-grow">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invitation Code</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            placeholder="Enter code"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="self-end">
                  Join
                </Button>
              </div>

              {form.formState.errors.code && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.code.message}
                </p>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
