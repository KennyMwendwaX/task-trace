import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from "./general-settings";
import ProfileSettings from "./profile-settings";
import NotificationSettings from "./notification-settings";
import { Session } from "@/lib/auth";

export default function SettingsForm({ session }: { session: Session }) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4 pt-4">
        <GeneralSettings />
      </TabsContent>
      <TabsContent value="profile" className="space-y-4 pt-4">
        <ProfileSettings session={session} />
      </TabsContent>
      <TabsContent value="notifications" className="space-y-4 pt-4">
        <NotificationSettings />
      </TabsContent>
    </Tabs>
  );
}
