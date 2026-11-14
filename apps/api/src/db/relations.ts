import { defineRelations } from "drizzle-orm";

import * as auth from "./schema/auth.js";
import * as task from "./schema/task.js";

export const relations = defineRelations({ ...auth, ...task }, (r) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
    tasks: r.many.task(),
  },
  session: {
    user: r.one.user({ from: r.session.userId, to: r.user.id }),
  },
  account: {
    user: r.one.user({ from: r.account.userId, to: r.user.id }),
  },
  task: {
    user: r.one.user({ from: r.task.userId, to: r.user.id }),
  },
}));
