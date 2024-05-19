import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { auth } from "../../auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { LuArrowUpRight, LuUserPlus, LuUserPlus2 } from "react-icons/lu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddProjectModal from "@/components/AddProjectModal";

export default async function Dashboard() {
  const session = await auth();
  return (
    <>
      <div className="text-2xl font-bold tracking-tight">
        Welcome, {session?.user?.name}!
      </div>

      <div className="mt-2">
        <div className="text-lg text-muted-foreground">Your Tasks Overview</div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Done</CardTitle>
              <CheckCircledIcon className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">23</div>
              <p className="text-sm text-muted-foreground">13% of all tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Todo</CardTitle>
              <CircleIcon className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">23</div>
              <p className="text-sm text-muted-foreground">13% of all tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                In Progress
              </CardTitle>
              <StopwatchIcon className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">23</div>
              <p className="text-sm text-muted-foreground">13% of all tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Canceled</CardTitle>
              <CrossCircledIcon className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">23</div>
              <p className="text-sm text-muted-foreground">13% of all tasks</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid gap-4 md:gap-4 lg:grid-cols-2 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle>Projects</CardTitle>
            <div className="ml-auto flex items-center gap-2">
              <AddProjectModal />
              <Button size="sm" variant="outline" className="gap-1">
                <LuUserPlus2 className="w-5 h-5" />
                <span>Join Project</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle className="text-lg">Active Projects</CardTitle>
                <CardDescription>Projects with the most tasks.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/projects">
                  View All
                  <LuArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Tasks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium hover:underline cursor-pointer">
                    Golang Command Line Interface tool
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default">50</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium hover:underline cursor-pointer">
                    Golang Command Line Interface tool
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default">50</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium hover:underline cursor-pointer">
                    Golang Command Line Interface tool
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default">50</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium hover:underline cursor-pointer">
                    Golang Command Line Interface tool
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default">50</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium hover:underline cursor-pointer">
                    Golang Command Line Interface tool
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default">50</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>
                Recent tasks assigned to you from your projects.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/tasks">
                View All
                <LuArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead className="text-right">Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium hover:underline cursor-pointer">
                    Golang Command Line Interface tool
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <LuArrowUpRight className="mr-1 h-5 w-5 text-red-500" />
                      <span>High</span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium hover:underline cursor-pointer">
                    Golang Command Line Interface tool
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <LuArrowUpRight className="mr-1 h-5 w-5 text-red-500" />
                      <span>High</span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium hover:underline cursor-pointer">
                    Golang Command Line Interface tool
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <LuArrowUpRight className="mr-1 h-5 w-5 text-red-500" />
                      <span>High</span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium hover:underline cursor-pointer">
                    Golang Command Line Interface tool
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <LuArrowUpRight className="mr-1 h-5 w-5 text-red-500" />
                      <span>High</span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium hover:underline cursor-pointer">
                    Golang Command Line Interface tool
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <LuArrowUpRight className="mr-1 h-5 w-5 text-red-500" />
                      <span>High</span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium hover:underline cursor-pointer">
                    Golang Command Line Interface tool
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <LuArrowUpRight className="mr-1 h-5 w-5 text-red-500" />
                      <span>High</span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium hover:underline cursor-pointer">
                    Golang Command Line Interface tool
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <LuArrowUpRight className="mr-1 h-5 w-5 text-red-500" />
                      <span>High</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
