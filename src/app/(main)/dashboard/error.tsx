"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Home, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-red-100 p-3 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Something went wrong!
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We encountered an unexpected error while processing your request.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="bg-muted p-4 rounded-lg text-left">
              <p className="font-mono text-sm break-all">{error.message}</p>
              {error.digest && (
                <p className="font-mono text-xs text-muted-foreground mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Don't worry - this has been logged and we'll look into it.
          </p>
        </CardContent>

        <CardFooter className="flex justify-center gap-4">
          <Button onClick={() => reset()} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
