import express  from "express";
import health from "./routes/health.route";
import auth from "./routes/auth.route";
import { setupSwagger } from "./swagger/swagger";
const app = express();

app.use(express.json());
// enable swagger docs
setupSwagger(app);
app.use("/health", health);
app.use("/auth", auth);

export default app;
