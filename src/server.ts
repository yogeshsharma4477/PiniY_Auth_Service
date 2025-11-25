import app from "./app";
import { ENV } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";

// must be last middleware
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  console.log(`Auth Service running on port ${ENV.PORT}`);
});
