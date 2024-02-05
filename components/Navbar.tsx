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
import { PersonIcon } from "@radix-ui/react-icons";
import { MdLogout } from "react-icons/md";
import { logout } from "@/actions/auth/logout";
import { Session } from "next-auth/types";

type Props = {
  session: Session | null;
};

export default function Navbar({ session }: Props) {
  return (
    <nav className="bg-gray-50 border-b border-gray-200 px-4 py-[8px] dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
      <div className="flex flex-wrap items-center justify-between mx-auto px-6 py-[6px]">
        <div className="flex items-center space-x-8">
          <div className="space-x-3 items-center">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                TaskTracker
              </span>
            </Link>
          </div>
        </div>
        <div className="flex md:order-2 items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 border border-gray-600 cursor-pointer">
                <AvatarImage src={""} alt="profile-image" />
                <AvatarFallback className="bg-white">
                  <PersonIcon className="h-5 w-5 text-gray-600" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button onClick={() => logout()} className="flex items-center">
                  <MdLogout className="mr-1 w-4 h-4" />
                  Log out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
