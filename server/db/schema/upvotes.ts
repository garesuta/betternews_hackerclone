import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userTable } from "./auth";
import { postsTable } from "./posts";
import { commentsTable } from "./comments";

export const postUpvotesTable = pgTable("post_upvotes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const commentUpvotesTable = pgTable("comment_upvotes", {
  id: serial("id").primaryKey(),
  commentId: integer("comment_id").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const postUpvotesRelations = relations(postUpvotesTable, ({ one }) => ({
  user: one(userTable, {
    fields: [postUpvotesTable.userId],
    references: [userTable.id],
    relationName: "postUpvotes",
  }),
  post: one(postsTable, {
    fields: [postUpvotesTable.postId],
    references: [postsTable.id],
  }),
}));

export const commentUpvotesRelations = relations(
  commentUpvotesTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [commentUpvotesTable.userId],
      references: [userTable.id],
    }),
    comment: one(commentsTable, {
      fields: [commentUpvotesTable.commentId],
      references: [commentsTable.id],
    }),
  }),
);
