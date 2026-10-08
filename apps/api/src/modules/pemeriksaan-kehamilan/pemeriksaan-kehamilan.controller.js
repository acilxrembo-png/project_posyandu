import * as pemeriksaanKehamilanService from "./pemeriksaan-kehamilan.service.js";

// GET /
async function list(req, res) {
  const result = await pemeriksaanKehamilanService.list(req.query, req.user);
  res.json(result);
}

// GET /:id
async function getById(req, res) {
  const data = await pemeriksaanKehamilanService.getById(req.params.id, req.user);
  res.json({ data });
}

// POST /
async function create(req, res) {
  const data = await pemeriksaanKehamilanService.create(req.body, req.user);
  res.status(201).json({ data });
}

// PATCH/PUT /:id
async function update(req, res) {
  const data = await pemeriksaanKehamilanService.update(req.params.id, req.body, req.user);
  res.json({ data });
}

// DELETE /:id
async function remove(req, res) {
  await pemeriksaanKehamilanService.remove(req.params.id, req.user);
  res.json({ message: "Data berhasil dihapus" });
}

export { list, getById, create, update, remove };
