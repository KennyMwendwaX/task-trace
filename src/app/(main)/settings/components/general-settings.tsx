"use client";

import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sun, Moon, Monitor } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import DeleteAccountModal from "./delete-account-modal";
import { Session } from "@/lib/auth";

export default function GeneralSettings({ session }: { session: Session }) {
  const { setTheme, theme, resolvedTheme, systemTheme } = useTheme();
  // Add this to handle hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Make sure component is mounted before rendering theme-dependent content
  useEffect(() => {
    setMounted(true);
  }, []);

  const actualTheme =
    theme === "system"
      ? systemTheme || (resolvedTheme === "dark" ? "dark" : "light")
      : theme;

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const isSystemThemeDark = systemTheme === "dark";

  const handleThemeCardClick = (themeValue: "light" | "dark" | "system") => {
    setTheme(themeValue);
  };

  // Don't render theme-dependent UI until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how the app looks and feels.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Theme</h3>
                {getThemeIcon(theme || "light")}
                <span className="text-sm text-muted-foreground capitalize">
                  {theme || "light"}
                  {theme === "system" && actualTheme && ` (${actualTheme})`}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Select your preferred theme.
              </p>
            </div>
            <RadioGroup
              value={theme || "light"}
              onValueChange={setTheme}
              className="grid grid-cols-3 gap-4 pt-2">
              {/* Light Theme */}
              <div
                className={`cursor-pointer [&:has([data-state=checked])>div]:border-primary`}
                onClick={() => handleThemeCardClick("light")}>
                <RadioGroupItem
                  value="light"
                  id="light"
                  className="sr-only"
                  checked={theme === "light"}
                />
                <div
                  className={`items-center rounded-md border-2 ${
                    theme === "light" ? "border-primary" : "border-muted"
                  } p-1 hover:border-accent`}>
                  <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                    <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-2 w-4/5 max-w-[80px] rounded-lg bg-[#ecedef]" />
                      <div className="h-2 w-full max-w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                      <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full p-2">
                  <span className="text-center font-normal">Light</span>
                  {theme === "light" && <Sun className="h-4 w-4" />}
                </div>
              </div>

              {/* Dark Theme */}
              <div
                className={`cursor-pointer [&:has([data-state=checked])>div]:border-primary`}
                onClick={() => handleThemeCardClick("dark")}>
                <RadioGroupItem
                  value="dark"
                  id="dark"
                  className="sr-only"
                  checked={theme === "dark"}
                />
                <div
                  className={`items-center rounded-md border-2 ${
                    theme === "dark" ? "border-primary" : "border-muted"
                  } bg-popover p-1 hover:bg-accent hover:text-accent-foreground`}>
                  <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                    <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-2 w-4/5 max-w-[80px] rounded-lg bg-slate-400" />
                      <div className="h-2 w-full max-w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full p-2">
                  <span className="text-center font-normal">Dark</span>
                  {theme === "dark" && <Moon className="h-4 w-4" />}
                </div>
              </div>

              {/* System Theme */}
              <div
                className={`cursor-pointer [&:has([data-state=checked])>div]:border-primary`}
                onClick={() => handleThemeCardClick("system")}>
                <RadioGroupItem
                  value="system"
                  id="system"
                  className="sr-only"
                  checked={theme === "system"}
                />
                <div
                  className={`items-center rounded-md border-2 ${
                    theme === "system" ? "border-primary" : "border-muted"
                  } p-1 hover:border-accent`}>
                  <div
                    className={`space-y-2 rounded-sm ${
                      isSystemThemeDark ? "bg-slate-950" : "bg-[#ecedef]"
                    } p-2`}>
                    <div
                      className={`space-y-2 rounded-md ${
                        isSystemThemeDark ? "bg-slate-800" : "bg-white"
                      } p-2 shadow-sm`}>
                      <div
                        className={`h-2 w-4/5 max-w-[80px] rounded-lg ${
                          isSystemThemeDark ? "bg-slate-400" : "bg-[#ecedef]"
                        }`}
                      />
                      <div
                        className={`h-2 w-full max-w-[100px] rounded-lg ${
                          isSystemThemeDark ? "bg-slate-400" : "bg-[#ecedef]"
                        }`}
                      />
                    </div>
                    <div
                      className={`flex items-center space-x-2 rounded-md ${
                        isSystemThemeDark ? "bg-slate-800" : "bg-white"
                      } p-2 shadow-sm`}>
                      <div
                        className={`h-4 w-4 rounded-full ${
                          isSystemThemeDark ? "bg-slate-400" : "bg-[#ecedef]"
                        }`}
                      />
                      <div
                        className={`h-2 w-[100px] rounded-lg ${
                          isSystemThemeDark ? "bg-slate-400" : "bg-[#ecedef]"
                        }`}
                      />
                    </div>
                    <div
                      className={`flex items-center space-x-2 rounded-md ${
                        isSystemThemeDark ? "bg-slate-800" : "bg-white"
                      } p-2 shadow-sm`}>
                      <div
                        className={`h-4 w-4 rounded-full ${
                          isSystemThemeDark ? "bg-slate-400" : "bg-[#ecedef]"
                        }`}
                      />
                      <div
                        className={`h-2 w-[100px] rounded-lg ${
                          isSystemThemeDark ? "bg-slate-400" : "bg-[#ecedef]"
                        }`}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full p-2">
                  <span className="text-center font-normal">System</span>
                  {theme === "system" && <Monitor className="h-4 w-4" />}
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Rest of the component remains the same */}
          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <h3 className="font-medium">Difficulty Preference</h3>
                <p className="text-sm text-muted-foreground">
                  Set your default quiz difficulty.
                </p>
              </div>
              <Select defaultValue="BEGINNER">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <h3 className="font-medium">Time Limit</h3>
                <p className="text-sm text-muted-foreground">
                  Enable time limits for quizzes by default.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all your data.
                </p>
              </div>
              <DeleteAccountModal session={session} />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
