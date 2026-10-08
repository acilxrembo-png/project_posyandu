import * as usersService from "./users.service.js";
import { createUserSchema } from "./users.validation.js";

async function list(req, res) {
  const result = await usersService.list(req.query);
  res.json(result);
}

async function getById(req, res) {
  const data = await usersService.getById(req.params.id);
  res.json({ data });
}

async function create(req, res) {
  const input = createUserSchema.parse(req.body);
  const data = await usersService.create(input);
  res.status(201).json({ data });
}

async function remove(req, res) {
  await usersService.remove(req.params.id, req.user);
  res.json({ message: "User berhasil dihapus" });
}

export { list, getById, create, remove };
