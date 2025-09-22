import { hc } from "hono/client"
import type { ApiRoutes, ErrorResponse, SuccessResponse } from "@/shared/types"
import { queryOptions } from "@tanstack/react-query"

const client = hc<ApiRoutes>("/", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    })
}).api

// type Test = InferResponseType<typeof client.auth.signup.$post, 404>
export const postSignup = async (username: string, password: string) => {
  try {
    const res = await client.auth.signup.$post({
      form: {
        username,
        password
      }
    })

    // Check if response has content before parsing JSON
    const text = await res.text()
    if (!text) {
      return {
        success: false as const,
        error: "Empty response from server",
        isFormError: false,
      } as ErrorResponse;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (_parseError) {
      return {
        success: false as const,
        error: `Invalid JSON response: ${text}`,
        isFormError: false,
      } as ErrorResponse;
    }

    if (res.ok) {
      return data as SuccessResponse
    }
    return data as ErrorResponse
  } catch (e) {
    return {
      success: false as const,
      error: String(e),
      isFormError: false,
    } as ErrorResponse;
  }
}

export const postLogin = async (username: string, password: string) => {
  try {
    const res = await client.auth.login.$post({
      form: {
        username,
        password
      }
    })

    // Check if response has content before parsing JSON
    const text = await res.text()
    if (!text) {
      return {
        success: false as const,
        error: "Empty response from server",
        isFormError: false,
      } as ErrorResponse;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (_parseError) {
      return {
        success: false as const,
        error: `Invalid JSON response: ${text}`,
        isFormError: false,
      } as ErrorResponse;
    }

    if (res.ok) {
      return data as SuccessResponse
    }
    return data as ErrorResponse
  } catch (e) {
    return {
      success: false as const,
      error: String(e),
      isFormError: false,
    } as ErrorResponse;
  }
}

export const getUser = async () => {
  const res = await client.auth.user.$get();
  if (res.ok) {
    const data = await res.json()
    return data.data?.username || null;
  }
  return null;
}

export const userQueryOptions = () => {
  return queryOptions({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: Infinity
  })
}