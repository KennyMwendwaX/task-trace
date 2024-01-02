import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PersonIcon } from "@radix-ui/react-icons";
import { MdLogout } from "react-icons/md";
import { ProjectorIcon, SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

export default function Navbar() {
  return (
    <>
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <Link className="lg:hidden" href="#">
          <ProjectorIcon className="h-6 w-6" />
          <span className="sr-only">Home</span>
        </Link>
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
                placeholder="Search projects..."
                type="search"
              />
            </div>
          </form>
        </div>
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={""} alt="profile-image" />
                  <AvatarFallback>
                    <PersonIcon className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    johndoe@gmail.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button className="flex items-center">
                  <MdLogout className="mr-1 w-4 h-4" />
                  Log out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
