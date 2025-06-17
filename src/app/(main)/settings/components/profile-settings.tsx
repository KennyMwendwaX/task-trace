"use client";

import { useRef, useState, ChangeEvent, useTransition } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  UserCircle,
  Mail,
  Loader2,
  Camera,
  User as UserIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { tryCatch } from "@/lib/try-catch";
import { updateUserProfile } from "@/server/actions/user/profile";
import { toast } from "sonner";
import { Session } from "@/lib/auth";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z
    .string()
    .min(1, { message: "This field is required" })
    .email("This is not a valid email"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileSettingsProps {
  session: Session;
}

export default function ProfileSettings({ session }: ProfileSettingsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [profileImage, setProfileImage] = useState<string>(
    session.user.image || "/api/placeholder/200/200"
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>): void => {
        if (e.target && typeof e.target.result === "string") {
          setProfileImage(e.target.result);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: session.user.email,
      name: session.user.name,
    },
  });

  function onSubmit(data: ProfileFormValues) {
    startTransition(async () => {
      const { data: updatedUser, error: userError } = await tryCatch(
        updateUserProfile(session.user.id, data)
      );

      if (userError) {
        toast.error(userError.message);
        return;
      }

      if (updatedUser) {
        form.reset();
        toast.success("Profile updated successfully!");
        router.refresh();
      }
    });
  }
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 space-y-4">
          <Card className="w-full max-w-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow">
                    <AvatarImage src={profileImage} alt="Profile picture" />
                    <AvatarFallback className="bg-primary-foreground">
                      <UserIcon className="h-12 w-12 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -right-2 -bottom-2 rounded-full h-8 w-8"
                    variant="secondary"
                    onClick={handleImageClick}>
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    aria-label="Upload profile picture"
                  />
                </div>

                <div className="text-center space-y-1">
                  <h3 className="font-semibold text-lg">{session.user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>

                <Badge variant="outline" className="px-3 py-1">
                  Premium Member
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Card className="flex flex-col h-full">
            <CardHeader className="pb-3">
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your personal information and settings
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form
                className="px-6 py-4 space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <UserCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-sm font-medium">Basic Information</h3>
                  </div>
                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                              <Input
                                placeholder="Your email"
                                className="pl-9"
                                {...field}
                                disabled
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <CardFooter className="border-t px-0 py-4 flex justify-between">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
