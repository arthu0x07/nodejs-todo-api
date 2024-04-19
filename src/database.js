import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #database = [];

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  list() {
    const tasksDatabase = this.#database ?? [];

    return tasksDatabase;
  }

  insert(task = { title, description, completed_at, created_at, updated_at }) {
    const taskID = randomUUID();

    task = { ...task, id: taskID };

    this.#database.push(task);

    this.#persist();

    return taskID;
  }

  delete(taskID) {
    if (!taskID) {
      return false;
    }

    const taskIndexToBeDeleted = this.#database.findIndex((task, index) => {
      if (task.id === taskID) {
        return index;
      }
    });

    this.#database.splice(taskIndexToBeDeleted, 1);
    this.#persist();

    return true;
  }
}

// database = [{id: UUID, title: String(), description: String(), completed_at: String(), created_at: String(), updated_at: String}]
