import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import z from "zod";
import { sessionTable, userRelations, userTable } from "./db/schema/auth";
import { postsRelations, postsTable } from "./db/schema/posts";
import { commentRelations, commentsTable } from "./db/schema/comments";
import { commentUpvotesTable, postUpvotesTable } from "./db/schema/upvotes";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
});

const processEnv = EnvSchema.parse(process.env);

const queryClient = postgres(processEnv.DATABASE_URL);

const db = drizzle(queryClient, {
  schema: {
    user: userTable,
    session: sessionTable,
    posts: postsTable,
    comments: commentsTable,
    postUpvotes: postUpvotesTable,
    commentUpvoted: commentUpvotesTable,
    postsRelations,
    commentRelations,
    userRelations,
  },
});

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionTable,
  userTable,
);
export { db, queryClient };
