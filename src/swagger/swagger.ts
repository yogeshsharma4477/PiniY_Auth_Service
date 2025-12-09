import path from "path";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const filePath = path.resolve(__dirname, "../../swagger/openapi.yaml");
  const swaggerDocument = YAML.load(filePath);

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
