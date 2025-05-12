import { createServer } from "http";
import { database } from "../database";
import { router } from "../router";
import request from "supertest";

describe("Users API", () => {
  const server = createServer(router);

  beforeEach(() => {
    database.getAllUsers().forEach((user) => {
      database.deleteUser(user.id);
    });
  });

  describe("Tests for AP", () => {
    it("GET /api/users should return empty array", async () => {
      const response = await request(server).get("/api/users");

      expect(response.body).toEqual([]);
    });

    it("POST /api/users should create a new user", async () => {
      const newUser = { username: "Jim", age: 25, hobbies: ["hockey"] };
      const response = await request(server).post("/api/users").send(newUser);

      expect(response.body).toMatchObject(newUser);
    });

    it("GET api/users/{userId} should get a user by ID", async () => {
      const newUser = { username: "Jim", age: 25, hobbies: ["hockey"] };
      const newUserResponse = await request(server)
        .post("/api/users")
        .send(newUser);
      const userId = newUserResponse.body.id;
      const response = await request(server).get(`/api/users/${userId}`);

      expect(response.body).toEqual(newUserResponse.body);
    });

    it("PUT api/users/{userId} should update a user", async () => {
      const newUser = { username: "Jim", age: 25, hobbies: ["hockey"] };
      const newUserResponse = await request(server)
        .post("/api/users")
        .send(newUser);
      const userId = newUserResponse.body.id;

      const updatedUser = {
        username: "Jim",
        age: 26,
        hobbies: ["hockey", "reading"],
      };
      const updatedResponse = await request(server)
        .put(`/api/users/${userId}`)
        .send(updatedUser);

      expect(updatedResponse.body).toMatchObject(updatedUser);
      expect(updatedResponse.body.id).toEqual(userId);
    });
  });
});
