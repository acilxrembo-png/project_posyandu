import * as pemeriksaanLansiaService from "./pemeriksaan-lansia.service.js";

// GET /
async function list(req, res) {
  const result = await pemeriksaanLansiaService.list(req.query, req.user);
  res.json(result);
}

// GET /:id
async function getById(req, res) {
  const data = await pemeriksaanLansiaService.getById(req.params.id, req.user);
  res.json({ data });
}

// POST /
async function create(req, res) {
  const data = await pemeriksaanLansiaService.create(req.body, req.user);
  res.status(201).json({ data });
}

// PATCH/PUT /:id
async function update(req, res) {
  const data = await pemeriksaanLansiaService.update(req.params.id, req.body, req.user);
  res.json({ data });
}

// DELETE /:id
async function remove(req, res) {
  await pemeriksaanLansiaService.remove(req.params.id, req.user);
  res.json({ message: "Data berhasil dihapus" });
}

export { list, getById, create, update, remove };
