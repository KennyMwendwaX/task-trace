import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Projects() {
  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:px-6 py-4">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl">Projects</h1>
          <Button className="ml-auto" size="sm">
            New Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="inline-block">
              <h2 className="font-semibold text-lg">Project Alpha</h2>
              <Badge
                variant="outline"
                className="border-orange-600 text-orange-500">
                In Progress
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Initial project for the new client.
              </p>
              <p className="text-sm text-gray-500">Task Completion Rate:</p>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full text-xs text-center text-white bg-blue-500 rounded-full"
                  style={{
                    width: "70%",
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">Total Tasks: 50</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="inline-block">
              <h2 className="font-semibold text-lg">Project Beta</h2>
              <Badge
                variant="outline"
                className="border-green-600 text-green-500">
                Completed
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Additional features for the main product.
              </p>
              <p className="text-sm text-gray-500">Task Completion Rate:</p>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full text-xs text-center text-white bg-green-500 rounded-full"
                  style={{
                    width: "100%",
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">Total Tasks: 30</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Project Gamma</h2>
              <span className="text-sm text-gray-500">Not Started</span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                A new mobile app for the customer platform.
              </p>
              <p className="text-sm text-gray-500">Task Completion Rate:</p>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full text-xs text-center text-white bg-red-500 rounded-full"
                  style={{
                    width: "0%",
                  }}
                />
              </div>
              <p className="text-sm text-gray-500">Total Tasks: 20</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
