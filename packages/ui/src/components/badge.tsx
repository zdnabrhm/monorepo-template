import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-neutral-900/15 bg-neutral-100 text-neutral-900 [a]:hover:bg-neutral-300 dark:border-primary/20 dark:bg-primary/10 dark:text-primary dark:[a]:hover:bg-primary/15",
        secondary: "border-neutral-900/15 bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80 dark:border-neutral-100/20",
        info: "border-blue-800/20 bg-blue-100 text-blue-800 focus-visible:ring-info-border/30 [a]:hover:bg-blue-300 dark:border-info-border/30 dark:bg-info/20 dark:text-info dark:[a]:hover:bg-info/25",
        success:
          "border-emerald-800/20 bg-emerald-100 text-emerald-800 focus-visible:ring-success-border/30 [a]:hover:bg-emerald-300 dark:border-success-border/30 dark:bg-success/20 dark:text-success dark:[a]:hover:bg-success/25",
        warning:
          "border-amber-800/20 bg-amber-100 text-amber-800 focus-visible:ring-warning-border/30 [a]:hover:bg-amber-300 dark:border-warning-border/30 dark:bg-warning/20 dark:text-warning dark:[a]:hover:bg-warning/25",
        destructive:
          "border-red-800/20 bg-red-100 text-red-800 focus-visible:ring-destructive-border/30 [a]:hover:bg-red-300 dark:border-destructive-border/30 dark:bg-destructive/20 dark:text-destructive dark:[a]:hover:bg-destructive/25",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
