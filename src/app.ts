import express  from "express";
import health from "./routes/health.route.js";
import auth from "./routes/auth.route.js";
import { setupSwagger } from "./swagger/swagger.js";
const app = express();

app.use(express.json());
// enable swagger docs
setupSwagger(app);
app.use("/health", health);
app.use("/auth", auth);

export default app;
