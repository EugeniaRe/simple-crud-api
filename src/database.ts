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

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  deleteUser(id: string): User | undefined {
    const deleted = this.users.find((user) => user.id === id);
    this.users = this.users.filter((user) => user.id !== id);
    return deleted;
  }

  updateUser(id: string, userData: UserWithoutId): User | undefined {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return undefined;
    }

    this.users[index] = { id, ...userData };

    return this.users[index];
  }
}

export const database = new Database();
