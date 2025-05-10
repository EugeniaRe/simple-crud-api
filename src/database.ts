import { v4 as uuidv4 } from "uuid";
import { User, UserWithoutId } from "./types";

class Database {
  private users: User[] = [];

  getAllUsers() {
    return this.users;
  }

  addUser(userData: UserWithoutId): User {
    const newUser = {
      id: uuidv4(),
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }
}

export const database = new Database();
