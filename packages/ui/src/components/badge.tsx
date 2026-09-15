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
          "border-primary-border bg-linear-to-b from-primary-start to-primary-end text-primary-foreground [a]:hover:brightness-95",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        info: "border-info-border bg-linear-to-b from-info-start to-info-end text-info-foreground focus-visible:ring-info-border/30 [a]:hover:brightness-95",
        success:
          "border-success-border bg-linear-to-b from-success-start to-success-end text-success-foreground focus-visible:ring-success-border/30 [a]:hover:brightness-95",
        warning:
          "border-warning-border bg-linear-to-b from-warning-start to-warning-end text-warning-foreground focus-visible:ring-warning-border/30 [a]:hover:brightness-95",
        destructive:
          "border-destructive-border bg-linear-to-b from-destructive-start to-destructive-end text-destructive-foreground focus-visible:ring-destructive-border/30 [a]:hover:brightness-95",
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
