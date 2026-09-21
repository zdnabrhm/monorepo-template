import { Separator } from "@monorepo/ui/components/separator";

import { ChangePasswordForm } from "./change-password-form";
import { ProfileForm } from "./profile-form";

export function SettingsPage({ user }: { user: { name: string; email: string } }) {
  return (
    <main className="flex flex-1 flex-col gap-8 p-4">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">Manage your profile and credentials.</p>
        </div>
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-medium">Profile</h2>
            <p className="text-sm text-muted-foreground">
              Your display name as shown across the platform and the address you sign in with. Email
              changes take effect immediately.
            </p>
          </div>
          <ProfileForm name={user.name} email={user.email} />
        </section>
        <Separator />
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-medium">Password</h2>
            <p className="text-sm text-muted-foreground">
              Use at least 8 characters. Changing it signs you out of other sessions.
            </p>
          </div>
          <ChangePasswordForm />
        </section>
      </div>
    </main>
  );
}
