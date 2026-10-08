import * as portalService from "./portal.service.js";

async function children(req, res) {
  const result = await portalService.listChildren(req.user);
  res.json(result);
}

export { children };
