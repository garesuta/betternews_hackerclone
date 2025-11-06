import { hc, InferResponseType } from "hono/client";
import type {
  ApiRoutes,
  ErrorResponse,
  Order,
  SortBy,
  SuccessResponse,
} from "@/shared/types";
import { queryOptions } from "@tanstack/react-query";

const client = hc<ApiRoutes>("", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
}).api;

// type Test = InferResponseType<typeof client.auth.signup.$post, 404>
export const postSignup = async (username: string, password: string) => {
  try {
    const res = await client.auth.signup.$post({
      form: {
        username,
        password,
      },
    });
    if (res.ok) {
      const data = (await res.json()) as SuccessResponse;
      return data;
    }
    const data = (await res.json()) as unknown as ErrorResponse;
    return data;
  } catch (e) {
    return {
      success: false as const,
      error: String(e),
      isFormError: false,
    } as ErrorResponse;
  }
};

export const postLogin = async (username: string, password: string) => {
  try {
    const res = await client.auth.login.$post({
      form: {
        username,
        password,
      },
    });

    if (res.ok) {
      const data = (await res.json()) as SuccessResponse;
      return data;
    }
    const data = (await res.json()) as unknown as ErrorResponse;
    return data;
  } catch (e) {
    return {
      success: false as const,
      error: String(e),
      isFormError: false,
    } as ErrorResponse;
  }
};

export type GetPostsSuccess = InferResponseType<typeof client.posts.$get>;

export const getPosts = async ({
  pageParam = 1,
  pagination,
  limit = 5,
}: {
  pageParam: number;
  pagination: {
    sortBy?: SortBy;
    order?: Order;
    author?: string;
    site?: string;
  };
  limit?: number;
}) => {
  const queryParams = {
    page: pageParam.toString(),
    limit: limit.toString(),
    ...(pagination.sortBy && { sortBy: pagination.sortBy }),
    ...(pagination.order && { order: pagination.order }),
    ...(pagination.author && { author: pagination.author }),
    ...(pagination.site && { site: pagination.site }),
  };

  const res = await client.posts.$get({
    query: queryParams,
  });

  if (!res.ok) {
    // Read the response body only once
    try {
      const responseText = await res.text();

      // If we got a plain text 404, the proxy might not be working
      if (res.status === 404 && !responseText.startsWith("{")) {
        throw new Error(
          "API endpoint not found - make sure backend server is running and Vite proxy is configured correctly",
        );
      }

      // Try to parse as JSON
      try {
        const data = JSON.parse(responseText) as unknown as ErrorResponse;
        throw new Error(data.error || `Server error: ${res.status}`);
      } catch (jsonError) {
        if (jsonError instanceof SyntaxError) {
          throw new Error(
            `Server error: ${res.status} - Response was not JSON: ${responseText.substring(0, 100)}`,
          );
        }
        throw jsonError;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes("API endpoint not found") ||
        errorMessage.includes("Response was not JSON")
      ) {
        throw error;
      }
      throw new Error(`Server error: ${res.status} - ${errorMessage}`);
    }
  }

  const data = await res.json();
  return data;
};

export const getUser = async () => {
  const res = await client.auth.user.$get();
  if (res.ok) {
    try {
      const responseText = await res.text();
      const data = JSON.parse(responseText);
      return data.data?.username || null;
    } catch {
      return null;
    }
  }
  return null;
};

export const userQueryOptions = () => {
  return queryOptions({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity,
  });
};

export async function upvotePost(id: string) {
  const res = await client.posts[":id"].upvote.$post({
    param: {
      id,
    },
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  const data = (await res.json()) as unknown as ErrorResponse;
  throw new Error(data.error);
}
