import env from "./config/env.config.js";
import app from "./app.js";

app.listen(env.port, () => {
  console.log(`API berjalan di http://localhost:${env.port}`);
});
