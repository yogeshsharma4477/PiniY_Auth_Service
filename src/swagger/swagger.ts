import path from "path";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function setupSwagger(app: Express) {
  const filePath = path.resolve(__dirname, "./openapi.yaml");
  const swaggerDocument = YAML.load(filePath);

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
