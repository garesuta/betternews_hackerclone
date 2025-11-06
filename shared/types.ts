import { insertCommentsSchema } from "../server/db/schema/comments";
import { insertPostsSchema } from "../server/db/schema/posts";
import z from "zod";
import type { ApiRoutes } from "../server/index";

export { type ApiRoutes };

// types that can shared both front, back
export type SuccessResponse<T = void> = {
  success: true;
  message: string;
} & (T extends void ? {} : { data: T });

export type ErrorResponse = {
  success: false;
  error: string;
  isFormError?: boolean;
};

export const loginSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(31)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(3).max(255),
});

export const createPostSchema = insertPostsSchema
  .pick({
    title: true,
    url: true,
    content: true,
  })
  .refine(
    (data) => {
      return data.url || data.content;
    },
    {
      message: "Either URL or Content must be provided",
      path: ["url", "content"],
    },
  );

export const sortBySchema = z.enum(["points", "recent"]);
export const orderSchema = z.enum(["asc", "desc"]);

export type SortBy = z.infer<typeof sortBySchema>;
export type Order = z.infer<typeof orderSchema>;

export const paginationSchema = z.object({
  limit: z.coerce.number().optional().default(1),
  page: z.coerce.number().optional().default(1),
  sortBy: sortBySchema.optional().default("points"),
  order: orderSchema.optional().default("desc"),
  author: z.optional(z.string()),
  site: z.string().optional(),
});

export const createCommentSchema = insertCommentsSchema.pick({ content: true });

export type Post = {
  id: number;
  title: string;
  url: string | null;
  content: string | null;
  points: number;
  createdAt: string;
  commentCount: number;
  author: {
    id: string;
    username: string;
  };
  isUpvoted: boolean;
};

export type Comment = {
  id: number;
  userId: string;
  content: string;
  points: number;
  depth: number;
  commentCount: number;
  createdAt: string;
  postId: number;
  parentCommentId: number | null;
  commentUpvotes: {
    userId: string;
  }[];
  author: {
    username: string;
    id: string;
  };
  isUpvoted?: boolean;
  childComments?: Comment[];
};

export type PaginatedResponse<T> = {
  pagination: {
    page: number;
    totalPages: number;
  };
  data: T;
} & Omit<SuccessResponse, "data">;
