# Monorepo Template

This template has a signed-in task CRUD example at `/tasks`.

- `apps/api/src/modules/tasks` owns the Hono routes, Zod request validation, and Drizzle table. Every task query uses the current session's user ID.
- `apps/platform/src/modules/tasks` owns requests, TanStack Query state, the Base Data Table, and task forms. The TanStack Router route in `src/routes` only connects the URL to the module.
- `src/modules/auth` in each app owns Better Auth integration. Better Auth and task primary keys use UUID v7.
- `apps/api/src/lib/errors.ts` defines the JSON error format for application routes: `{ "error": { "code": "...", "message": "..." } }`. Validation errors also include `issues`.

Run `pnpm db:up` and `pnpm db:migrate` before `pnpm dev`. The migrations create the Better Auth tables and then add tasks. Better Auth and task IDs use UUID v7.
