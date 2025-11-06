import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { orderSchema, sortBySchema } from "@/shared/types";
import z from "zod";
import {
  infiniteQueryOptions,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { getPosts } from "@/lib/api";
import { SortBar } from "@/components/sort-bar";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { useUpVotePost } from "@/lib/api-hooks";

const homeSearchSchema = z.object({
  sortBy: fallback(sortBySchema, "recent" as const),
  order: fallback(orderSchema, "desc" as const),
  author: z.string().optional(),
  site: z.string().optional(),
});

const postsInfiniteQueryOptions = (
  pagination: z.infer<typeof homeSearchSchema>,
) =>
  infiniteQueryOptions({
    queryKey: ["posts", pagination],
    queryFn: ({ pageParam }) => getPosts({ pageParam, pagination, limit: 5 }),
    initialPageParam: 1,
    staleTime: Infinity,
    getNextPageParam: (lastPage, _allPages, lastPageParams) => {
      if (lastPage.pagination.totalPages <= lastPageParams) {
        return undefined;
      }
      return lastPageParams + 1;
    },
  });

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: zodSearchValidator(homeSearchSchema),
});

function HomeComponent() {
  const { sortBy, order, author, site } = Route.useSearch();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(
      postsInfiniteQueryOptions({ sortBy, order, author, site }),
    );
  const upvoteMutation = useUpVotePost();
  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Submissions</h1>
      <SortBar sortBy={sortBy} order={order} />
      <div className="space-y-4">
        {data?.pages.map((page) =>
          page.data.map((post) => (
            <PostCard post={post} key={post.id} onUpvote={() => upvoteMutation.mutate(post.id.toString())} />
          )),
        )}
      </div>
      <div className="mt-6">
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More"
              : "No more posts"}
        </Button>
      </div>
    </div>
  );
}
