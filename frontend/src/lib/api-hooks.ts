import { Post } from "@/shared/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { GetPostsSuccess, upvotePost } from "./api";
import { current, produce } from "immer";
import { toast } from "sonner";

const updatePostUpVote = (draft: Post) => {
  draft.points += draft.isUpvoted ? -1 : +1;
  draft.isUpvoted = !draft.isUpvoted;
};

export const useUpVotePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upvotePost,
    onMutate: async (variable) => {
      let prevData;
      await queryClient.cancelQueries({
        queryKey: ["post", Number(variable)],
      });
      queryClient.setQueriesData<InfiniteData<GetPostsSuccess>>(
        {
          queryKey: ["posts"],
          type: "active",
        },
        produce((oldData) => {
          prevData = current(oldData);
          if (!oldData) {
            return undefined;
          }
          oldData.pages.forEach((page) => {
            page.data.forEach((post) => {
              if (post.id.toString() === variable) {
                updatePostUpVote(post);
              }
            });
          });
        }),
      );
      return { prevData };
    },
    onSuccess: (upVoteData, variable) => {
      queryClient.setQueriesData<InfiniteData<GetPostsSuccess>>(
        {
          queryKey: ["post"],
        },
        produce((oldData) => {
          if (!oldData) {
            return undefined;
          }
          oldData.pages.forEach((page) =>
            page.data.forEach((post) => {
              if (post.id.toString() === variable) {
                post.points = upVoteData.data.count;
                post.isUpvoted = upVoteData.data.isUpvoted;
              }
            }),
          );
        }),
      );
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        type: "inactive",
        refetchType: "none",
      });
    },
    onError: (err, variable, context) => {
      console.error(err);
      toast.error("Failed to upvote the post. Please try again.");
      if (context?.prevData) {
        queryClient.setQueriesData<InfiniteData<GetPostsSuccess>>(
          {
            queryKey: ["posts"],
            type: "active",
          },
          context.prevData,
        );
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }
    },
  });
};
