"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinFormSchema } from "@/lib/schema/UserSchema";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

type FormValues = {
  email: string;
  password: string;
};

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverErrors, setServerErrors] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(signinFormSchema),
  });

  const { data: session, status } = useSession();

  if (session && status === "authenticated") {
    redirect("/");
  }

  const errors = form.formState.errors;

  async function onSubmit(values: FormValues) {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false, // Do not redirect, so we can handle the result ourselves
      });

      if (result?.error) {
        // If there was an error, display the error message to the user
        setServerErrors(result.error);
      } else {
        // If there was no error, redirect the user to the home page
        redirect("/");
      }
    } catch (error) {
      // If there was an unexpected error, display a generic error message to the user
      setServerErrors("An unexpected error occurred. Please try again later.");
    }
  }

  // Handle Google Signin
  async function handleGoogleSignin() {
    signIn("google", { callbackUrl: "http://localhost:3000/" });
  }

  // Handle Github Signin
  async function handleGithubSignin() {
    signIn("github", { callbackUrl: "http://localhost:3000/" });
  }

  return (
    <>
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 bg-gray-100 md:h-screen lg:py-0">
        <a
          href="#"
          className="p-4 flex items-center text-2xl font-semibold text-black">
          {/* <Image className="mr-2 h-8 w-8" src={Img} alt="logo" /> */}
          TaskTracker
        </a>
        <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
              Sign in to your account
            </h1>

            {serverErrors && (
              <div
                className="mb-4 rounded-lg border border-red-600 bg-red-50 p-4 text-sm text-red-800"
                role="alert">
                {serverErrors}
              </div>
            )}

            <Form {...form}>
              <form
                className="space-y-3"
                onSubmit={form.handleSubmit(onSubmit)}>
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
                  Sign In
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
                onClick={handleGoogleSignin}
                variant="outline"
                className="w-full flex items-center">
                <Image width={20} height={20} alt="google" src="/google.svg" />
                &nbsp;Sign in with Google
              </Button>
              <Button
                variant="outline"
                onClick={handleGithubSignin}
                className="w-full flex items-center">
                <Image width={22} height={22} alt="github" src="/github.svg" />
                &nbsp;Sign in with Github
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
    </>
  );
}
