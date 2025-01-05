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
import { FaUser } from "react-icons/fa6";
import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupValues, signupSchema } from "@/lib/schema/UserSchema";
import { useRouter } from "next/navigation";
import Logo from "@/app/logo.png";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { signUp } from "./actions";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { data: session, status } = useSession();
  const router = useRouter();

  if (session && status === "authenticated") {
    router.push("/");
  }

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const errors = form.formState.errors;

  async function onSubmit(values: SignupValues) {
    startTransition(async () => {
      try {
        const result = await signUp(values);

        if (result.error) {
          toast.error(result.error);
        } else {
          form.reset();
          toast.success(result.message);
          router.push("/signin");
        }
      } catch (error) {
        console.error("Sign-up error:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  }

  return (
    <div className="mx-auto flex flex-col bg-gray-100 items-center justify-center px-6 py-8 md:h-screen lg:py-0">
      <div className="flex items-center gap-1 font-semibold whitespace-nowrap p-2">
        <Image src={Logo} width={32} height={28} alt="" />
        <span className="text-xl tracking-tighter">TaskTrace</span>
        <span className="sr-only">Logo</span>
      </div>
      <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
        <div className="space-y-3 p-6 sm:p-8 md:space-y-5">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
            Sign up to have an account
          </h1>
          <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="relative">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          id="name"
                          className={`${
                            errors.name?.message
                              ? `border-2 border-red-600 focus:border-red-600`
                              : `focus:border-blue-600`
                          } focus:border-2`}
                          placeholder="John Doe"
                          {...field}
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span
                  className={`${
                    errors.name?.message
                      ? `bottom-8 right-0`
                      : `bottom-2 right-0`
                  } absolute flex cursor-pointer items-center pr-3 text-gray-600`}>
                  <FaUser size={18} />
                </span>
                {errors.name?.message && (
                  <span className="text-xs text-red-600">
                    {errors.name?.message}
                  </span>
                )}
              </div>
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
              <div className="relative">
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type={!showConfirmPassword ? `password` : `text`}
                          id="confirm_password"
                          className={`${
                            errors.confirm_password?.message
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`${
                    errors.confirm_password?.message
                      ? `bottom-8 right-0`
                      : `bottom-2 right-0`
                  } absolute flex cursor-pointer items-center pr-3 ${
                    !showConfirmPassword ? `text-gray-600` : `text-blue-600`
                  }`}>
                  <HiFingerPrint size={20} />
                </span>
                {errors.confirm_password?.message && (
                  <span className="text-xs text-red-600">
                    {errors.confirm_password?.message}
                  </span>
                )}
              </div>
              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? "Signing up..." : "Sign Up"}
              </Button>
              <div className="text-sm font-light text-black">
                Have an account?
                <Link
                  href="/signin"
                  className="font-medium text-blue-600 hover:underline">
                  &nbsp;Sign In
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
