# Monorepo Template

This template has a signed-in task CRUD example at `/tasks`.

## Project structure

```
.
├── apps/
│   ├── api/
│   │   ├── drizzle/
│   │   │   ├── 0000_add_auth.sql           # Better Auth tables
│   │   │   └── 0001_add_tasks.sql          # task table
│   │   ├── drizzle.config.ts
│   │   └── src/
│   │       ├── app.ts                      # mounts CORS, Better Auth, and task routes
│   │       ├── index.ts                    # @hono/node-server entrypoint
│   │       ├── env.ts
│   │       ├── db/
│   │       │   ├── client.ts               # Drizzle client
│   │       │   └── schema/
│   │       │       ├── auth.ts             # user, session, account, verification tables
│   │       │       └── task.ts             # task table, task_status enum
│   │       ├── lib/
│   │       │   └── errors.ts               # ApiError, validationError, handleError
│   │       └── modules/
│   │           ├── auth/
│   │           │   ├── auth.ts             # Better Auth config: Drizzle adapter, UUID v7 IDs
│   │           │   └── require-session.ts  # middleware: sets userId or throws 401
│   │           └── tasks/
│   │               ├── routes.ts           # CRUD endpoints, zValidator on each route
│   │               ├── schema.ts           # Zod: list query, create/update bodies
│   │               └── service.ts          # Drizzle queries, scoped by userId
│   └── platform/
│       ├── index.html
│       ├── vite.config.ts
│       ├── tsr.config.json
│       └── src/
│           ├── main.tsx
│           ├── router.tsx
│           ├── query-client.ts
│           ├── env.ts
│           ├── components/                 # app shell
│           │   ├── app-sidebar.tsx
│           │   ├── breadcrumbs.tsx
│           │   └── nav-user.tsx
│           ├── modules/
│           │   ├── auth/
│           │   │   ├── auth-client.ts      # Better Auth React client
│           │   │   └── login-form.tsx
│           │   └── tasks/
│           │       ├── api.ts              # typed Hono client from AppType, error parsing
│           │       ├── queries.ts          # TanStack Query keys and queryOptions
│           │       ├── schema.ts           # status enum, search schema, Task types
│           │       └── components/
│           │           ├── tasks-page.tsx      # list: filters, search, pagination
│           │           ├── tasks-table.tsx     # Base Data Table
│           │           ├── task-detail-page.tsx
│           │           ├── task-form.tsx       # shared by new and edit
│           │           ├── new-task-page.tsx
│           │           ├── edit-task-page.tsx
│           │           └── task-status-badge.tsx
│           └── routes/
│               ├── __root.tsx              # root layout, TanStack devtools
│               ├── login.tsx               # redirects to / when signed in
│               └── _authenticated/
│                   ├── route.tsx           # session guard + sidebar layout
│                   ├── index.tsx           # dashboard
│                   └── tasks/
│                       ├── route.tsx       # validates search params via taskListSearchSchema
│                       ├── index.tsx       # renders TasksPage
│                       ├── new.tsx         # renders NewTaskPage
│                       └── $taskId/
│                           ├── route.tsx   # prefetches task for breadcrumb
│                           ├── index.tsx   # renders TaskDetailPage
│                           └── edit.tsx    # renders EditTaskPage
├── packages/
│   └── ui/
│       └── src/
│           ├── components/                 # shadcn/ui library (button, table, form, ...)
│           ├── hooks/
│           │   └── use-mobile.ts
│           ├── lib/
│           │   └── utils.ts
│           └── styles/
│               └── globals.css
└── tools/
    └── oxlint/
```

- Every task query in `apps/api` uses the current session's user ID. The TanStack Router routes in `apps/platform/src/routes` only connect the URL to the module.
- `apps/api/src/lib/errors.ts` defines the JSON error format for application routes: `{ "error": { "code": "...", "message": "..." } }`. Validation errors also include `issues`.
- Better Auth and task primary keys use UUID v7.

Run `pnpm db:up` and `pnpm db:migrate` before `pnpm dev`. The migrations create the Better Auth tables and then add tasks. Better Auth and task IDs use UUID v7.
