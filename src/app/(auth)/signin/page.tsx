"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SigninValues, signinSchema } from "@/lib/schema/UserSchema";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import Logo from "@/app/logo.png";
import { credentialsLogin, providerLogin } from "@/server/actions/auth/login";

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  if (session && status === "authenticated") {
    router.push("/");
  }

  const errors = form.formState.errors;

  async function onSubmit(values: SigninValues) {
    startTransition(async () => {
      try {
        const result = await credentialsLogin(values);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Sign in successful!");
        }
      } catch (error) {
        console.error("Sign-in error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  }

  async function providerSignin(provider: "google" | "github") {
    startTransition(async () => {
      try {
        const result = await providerLogin(provider);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Sign in successful!");
        }
      } catch (error) {
        console.error("Sign-in error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  }

  return (
    <div className="min-h-screen mx-auto flex flex-col bg-gray-100 items-center justify-center px-6 py-8 lg:py-0">
      <div className="flex items-center gap-1 font-semibold whitespace-nowrap p-2">
        <Image src={Logo} width={32} height={28} alt="" />
        <span className="text-xl tracking-tighter">TaskTrace</span>
        <span className="sr-only">Logo</span>
      </div>
      <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
            Sign in to your account
          </h1>

          <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="relative">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          id="email"
                          className={`${
                            errors.email?.message
                              ? `border-2 border-red-600 focus:border-red-600`
                              : `focus:border-blue-600`
                          } focus:border-2`}
                          placeholder="johndoe@gmail.com"
                          {...field}
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span
                  className={`${
                    errors.email?.message
                      ? `bottom-8 right-0`
                      : `bottom-2 right-0`
                  } absolute flex cursor-pointer items-center pr-3 text-gray-600`}>
                  <HiAtSymbol size={20} />
                </span>
                {errors.email?.message && (
                  <span className="text-xs text-red-600">
                    {errors.email?.message}
                  </span>
                )}
              </div>
              <div className="relative">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={!showPassword ? `password` : `text`}
                          id="password"
                          className={`${
                            errors.password?.message
                              ? `border-2 border-red-600 focus:border-red-600`
                              : `focus:border-blue-600`
                          } focus:border-2`}
                          placeholder="••••••••"
                          {...field}
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className={`${
                    errors.password?.message
                      ? `bottom-8 right-0`
                      : `bottom-2 right-0`
                  } absolute flex cursor-pointer items-center pr-3 ${
                    !showPassword ? `text-gray-600` : `text-blue-600`
                  }`}>
                  <HiFingerPrint size={20} />
                </span>
                {errors.password?.message && (
                  <span className="text-xs text-red-600">
                    {errors.password?.message}
                  </span>
                )}
              </div>

              <Button className="w-full" type="submit">
                {isPending ? "Signing up..." : "Sign Up"}{" "}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => providerSignin("google")}
              variant="outline"
              className="w-full flex items-center">
              <FcGoogle className="mr-1 w-5 h-5" />
              Sign in with Google
            </Button>
            <Button
              variant="outline"
              onClick={() => providerSignin("github")}
              className="w-full flex items-center">
              <FaGithub className="mr-1 w-5 h-5" />
              Sign in with Github
            </Button>
          </div>
          <p className="text-sm font-light text-black">
            Don&apos;t have an account?
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:underline">
              &nbsp;Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
