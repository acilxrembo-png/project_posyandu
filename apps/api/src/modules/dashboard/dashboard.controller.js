import * as dashboardService from "./dashboard.service.js";

async function stats(req, res) {
  const data = await dashboardService.getStats(req.user, req.query);
  res.json({ data });
}

export { stats };
