import { API_BASE_URL } from "@/utils/constants";

type ApiErrorDetails = {
  message: string;
  status: number;
};

export class ApiError extends Error {
  status: number;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.status = details.status;
  }
}

async function parseJsonSafely(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }
  return JSON.parse(text);
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const data = await parseJsonSafely(response);
    const message = data?.message ?? "Une erreur est survenue";
    throw new ApiError({ message, status: response.status });
  }

  return (await parseJsonSafely(response)) as T;
}
