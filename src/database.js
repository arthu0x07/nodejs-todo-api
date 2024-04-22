import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

import { formatDate } from "./utils/format-data.js";

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

  insert({ title, description, completed_at, created_at, updated_at }) {
    const taskID = randomUUID();
    const task = { title, description, completed_at, created_at, updated_at };

    task = { ...task, id: taskID, created_at: formatDate(new Date()) };

    this.#database.push(task);

    this.#persist();

    return taskID;
  }

  update(taskID, { title, description, completed_at, created_at, updated_at }) {
    if (!taskID) {
      return false;
    }

    const taskIndexToBeUptaded = this.#database.findIndex(
      (task) => task.id === taskID
    );

    updated_at = formatDate(new Date());

    const actualDataTask = this.#database[taskIndexToBeUptaded];
    const updatedDataTask = {
      ...actualDataTask,
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(completed_at !== undefined && { completed_at }),
      ...(created_at !== undefined && { created_at }),
      ...(updated_at !== undefined && { updated_at }),
    };

    this.#database[taskIndexToBeUptaded] = updatedDataTask;
    this.#persist();

    return true;
  }

  complete(taskID) {
    if (!taskID) {
      return false;
    }

    const taskIndexToBeUptaded = this.#database.findIndex(
      (task) => task.id === taskID
    );

    const actualDataTask = this.#database[taskIndexToBeUptaded];
    this.#database[taskIndexToBeUptaded] = {
      ...actualDataTask,
      completed_at: formatDate(new Date()),
    };

    this.#persist();

    return true;
  }
}

// database = [{id: UUID, title: String(), description: String(), completed_at: String(), created_at: String(), updated_at: String}]
