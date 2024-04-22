import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      const tasksData = database.list();

      res.writeHead(200).end(JSON.stringify(tasksData));
    },
  },

  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      const taskToCreate = req.body;

      const IDTaskCreated = database.insert(taskToCreate);

      res.writeHead(201).end(JSON.stringify(IDTaskCreated));
    },
  },

  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const taskID = req.params.id;
      const taskDataToUpdate = req.body;

      const IDTaskUpdated = database.update(taskID, taskDataToUpdate);

      const isTaskUpdated = IDTaskUpdated ? true : false;
      const statusCode = isTaskUpdated ? 204 : 400;

      res
        .writeHead(statusCode)
        .end(IDTaskUpdated ? JSON.stringify(IDTaskUpdated) : null);
    },
  },

  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const taskID = req.params.id;
      const isTaskDeleted = database.delete(taskID);

      const statusCode = isTaskDeleted ? 204 : 400;

      res.writeHead(statusCode).end();
    },
  },
];
