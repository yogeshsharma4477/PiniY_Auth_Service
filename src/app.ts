import express  from "express";
import health from "./routes/health.route";
import auth from "./routes/auth.route";
const app = express();

app.use(express.json());
app.use("/health", health);
app.use("/auth", auth);

export default app;
