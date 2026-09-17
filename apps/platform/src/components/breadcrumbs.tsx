import { Fragment } from "react";
import { z } from "zod";
import { Link, useMatches } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@monorepo/ui/components/breadcrumb";

type Crumb = {
  id: string;
  pathname: string;
  label: string;
};

// Child matches inherit their parent's context, including its breadcrumb label.
const crumbContextSchema = z.object({ breadcrumb: z.string() });

export function Breadcrumbs() {
  const crumbs = useMatches({
    select: (matches) =>
      matches.flatMap((match, index): Crumb[] => {
        const parsed = crumbContextSchema.safeParse(match.context);

        if (!parsed.success) return [];

        const previous = crumbContextSchema.safeParse(matches[index - 1]?.context);

        if (previous.success && parsed.data.breadcrumb === previous.data.breadcrumb) return [];

        return [{ id: match.id, pathname: match.pathname, label: parsed.data.breadcrumb }];
      }),
  });

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.id}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === crumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link to={crumb.pathname} />}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
