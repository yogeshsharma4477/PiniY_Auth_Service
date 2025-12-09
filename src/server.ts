import app from "./app.js";
import { ENV } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

// must be last middleware
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  console.log(`Auth Service running on port ${ENV.PORT}`);
});
