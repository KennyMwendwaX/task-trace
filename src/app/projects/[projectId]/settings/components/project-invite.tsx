import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LuClipboard, LuRotateCw } from "react-icons/lu";
import { toast } from "sonner";

export default function ProjectInvite() {
  const code = "Tzq63nZSNe";

  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => toast.success("Invitation code copied to clipboard!"))
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle className="text-xl">Project Invite</CardTitle>
        <CardDescription>
          Share this code to invite new members.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <p className="text-4xl font-mono font-bold text-primary">{code}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Expires in 7 days
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-destructive">
          <LuRotateCw className="w-4 h-4" />
          Regenerate
        </Button>
        <Button onClick={handleCopy} className="flex items-center gap-2">
          <LuClipboard className="w-4 h-4" />
          Copy Code
        </Button>
      </CardFooter>
    </Card>
  );
}
