import { database } from "./database";
import { RequestData } from "./types";

export const getUsers = () => {
  try {
    return {
      statusCode: 200,
      body: database.getAllUsers(),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { error: "Internal server error" },
    };
  }
};

export const addUser = (req: RequestData) => {
  if (req.body === undefined) {
    return {
      statusCode: 400,
      body: { error: "Body is required" },
    };
  }
  try {
    const { username, age, hobbies } = req.body;

    if (!username || !age || !hobbies) {
      return {
        statusCode: 400,
        body: {
          error:
            "Username, age and hobbies are required. Hobbies can be an empty array.",
        },
      };
    }

    if (
      typeof username !== "string" ||
      typeof age !== "number" ||
      !hobbies.every((item) => typeof item === "string")
    ) {
      return {
        statusCode: 400,
        body: { error: "Invalid data types" },
      };
    }

    hobbies;

    const newUser = database.addUser({ username, age, hobbies: hobbies });
    return {
      statusCode: 201,
      body: newUser,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { error: "Internal server error" },
    };
  }
};
