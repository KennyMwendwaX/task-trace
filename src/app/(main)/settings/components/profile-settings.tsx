"use client";

import { useRef, useState, ChangeEvent } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Camera,
  Instagram,
  Mail,
  UserCircle,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RiTwitterXLine } from "react-icons/ri";
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
  urls: z
    .object({
      x: z.string().url({ message: "Please enter a valid URL." }).optional(),
      instagram: z
        .string()
        .url({ message: "Please enter a valid URL." })
        .optional(),
    })
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileSettings({ session }: { session: Session }) {
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(
    "/api/placeholder/200/200"
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
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Profile card - now with align-self-start to prevent stretching */}
        <div className="w-full md:w-1/3 lg:w-1/4 self-start">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow">
                    <AvatarImage src={profileImage} alt="Profile picture" />
                    <AvatarFallback className="bg-primary-foreground">
                      <User className="h-12 w-12 text-primary" />
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

        {/* Form card */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <Card>
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

                <div className="pt-2">
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    <h3 className="text-sm font-medium">Social Links</h3>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="urls.x"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <RiTwitterXLine className="h-4 w-4" /> X (Twitter)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://x.com/username"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="urls.instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Instagram className="h-4 w-4" /> Instagram
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://instagram.com/username"
                              {...field}
                            />
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
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
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
