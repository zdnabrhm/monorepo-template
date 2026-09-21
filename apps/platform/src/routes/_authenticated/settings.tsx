import { createFileRoute } from "@tanstack/react-router";

import { SettingsPage } from "@/modules/settings/components/settings-page";

export const Route = createFileRoute("/_authenticated/settings")({
  beforeLoad: () => ({ breadcrumb: "Settings" }),
  component: SettingsRoute,
});

function SettingsRoute() {
  const { session } = Route.useRouteContext();

  return <SettingsPage user={session.user} />;
}
