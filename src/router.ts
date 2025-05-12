import { IncomingMessage, ServerResponse } from "http";
import { APIResponse, RequestData, User } from "./types";
import {
  addUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./controllers";

export const router = async (req: IncomingMessage, res: ServerResponse) => {
  const requestData = await parseRequest(req);
  let response: APIResponse;

  try {
    if (req.url === "/api/users" && req.method === "GET") {
      response = getUsers();
    } else if (req.url === "/api/users" && req.method === "POST") {
      response = addUser(requestData);
    } else if (req.url?.startsWith("/api/users/") && req.method === "GET") {
      response = getUserById(requestData);
    } else if (req.url?.startsWith("/api/users/") && req.method === "DELETE") {
      response = deleteUser(requestData);
    } else if (req.url?.startsWith("/api/users/") && req.method === "PUT") {
      response = updateUser(requestData);
    } else {
      response = {
        statusCode: 404,
        body: { error: "Endpoint not found" },
      };
    }
  } catch (error) {
    response = {
      statusCode: 500,
      body: { error: "Internal server error" },
    };
  }

  sendResponse(res, response);
};

export function sendResponse(res: ServerResponse, apiResponse: APIResponse) {
  res.statusCode = apiResponse.statusCode;
  res.setHeader("Content-Type", "application/json");

  if (apiResponse.headers) {
    Object.entries(apiResponse.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }

  if (apiResponse.statusCode !== 204 && apiResponse.body) {
    res.end(JSON.stringify(apiResponse.body));
  } else {
    res.end();
  }
}

export async function parseRequest(req: IncomingMessage) {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const pathParts = url.pathname.split("/").filter(Boolean);

  const requestData: RequestData = {
    method: req.method || "GET",
    path: url.pathname,
    headers: req.headers as Record<string, string | undefined>,
    params: pathParts[2] ? { id: pathParts[2] } : undefined,
  };

  if (req.method === "POST" || req.method === "PUT") {
    requestData.body = await parseBody(req);
  }

  return requestData;
}

export function parseBody(req: IncomingMessage): Promise<User | undefined> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve(undefined);
      }
    });
  });
}
