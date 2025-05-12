export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface APIResponse {
  statusCode: number;
  body?: unknown;
  headers?: Record<string, string>;
}

export type UserWithoutId = Omit<User, "id">;

export interface RequestData {
  method: string;
  path: string;
  headers: Record<string, string | undefined>;
  body?: User | undefined;
  params?: Record<string, string>;
}
