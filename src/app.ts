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

console.log("code reach3dd");

export default app;

// IAM police and persmission for lambda function
// Next Steps:
// CI-CD prepare AWS evnironomt, yaml file or serverless file 
// move routes to lambda function
// create API route then call API route, route53 ?
// or link route53 to API gateway
// then call lambda function from API gateway
// then deploy API gateway and lambda function using serverless framework
// route 53 to point to API gateway URL: last step
