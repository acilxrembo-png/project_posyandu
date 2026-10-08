import * as imunisasiService from "./imunisasi.service.js";

// GET /
async function list(req, res) {
  const result = await imunisasiService.list(req.query, req.user);
  res.json(result);
}

// GET /:id
async function getById(req, res) {
  const data = await imunisasiService.getById(req.params.id, req.user);
  res.json({ data });
}

// POST /
async function create(req, res) {
  const data = await imunisasiService.create(req.body, req.user);
  res.status(201).json({ data });
}

// PATCH/PUT /:id
async function update(req, res) {
  const data = await imunisasiService.update(req.params.id, req.body, req.user);
  res.json({ data });
}

// DELETE /:id
async function remove(req, res) {
  await imunisasiService.remove(req.params.id, req.user);
  res.json({ message: "Data berhasil dihapus" });
}

export { list, getById, create, update, remove };
