import fs from "node:fs/promises";

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

  #database = [
    {
      title: "test",
      name: "teioaskopd",
    },
  ];

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  list() {
    const tasks = this.#database ?? [];

    return tasks;
  }
}

// database = [{id: UUID, title: String(), description: String(), completed_at: String(), created_at: String(), updated_at: String}]
