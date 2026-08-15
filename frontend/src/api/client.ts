import { clearAuthSession, loadAuthSession } from "../utils/localStorage";

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  requiresAuth?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { body, headers, requiresAuth = true, ...requestOptions } = options;
  const authSession = loadAuthSession();

  if (requiresAuth && !authSession) {
    throw new ApiError("You need to log in again.", 401);
  }

  const response = await fetch(path, {
    ...requestOptions,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(requiresAuth && authSession
        ? { Authorization: `Bearer ${authSession.token}` }
        : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 || response.status === 403) {
    clearAuthSession();
  }

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

const getErrorMessage = async (response: Response) => {
  try {
    const responseBody = await response.json();

    if (typeof responseBody.message === "string") {
      return responseBody.message;
    }

    if (typeof responseBody.error === "string") {
      return responseBody.error;
    }
  } catch {
    // Use the generic fallback below when the response is not JSON.
  }

  return "Something went wrong. Please try again.";
};
