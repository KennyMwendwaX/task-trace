"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignIn from "./components/sign-in";
import SignUp from "./components/sign-up";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState } from "react";

export default function SignInPage() {
  const [isLoading] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 py-4">
          <CardTitle className="text-xl text-center">
            Welcome to TaskTrace
          </CardTitle>
          <CardDescription className="text-center text-sm">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="py-2">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="pt-3">
              <SignIn />
            </TabsContent>
            <TabsContent value="signup" className="pt-3">
              <SignUp />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 py-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
            <Button variant="outline" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <AiOutlineLoading3Quarters className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <FcGoogle className="mr-1 h-4 w-4" />
              )}
              Google
            </Button>
            <Button variant="outline" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <AiOutlineLoading3Quarters className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <FaGithub className="mr-1 h-4 w-4" />
              )}
              Github
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
