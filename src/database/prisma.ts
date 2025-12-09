import { prisma } from "../prisma/client.js";

// Re-export the shared Prisma instance from `src/prisma/client.ts` so any
// module can import the singleton via `src/database/prisma.ts` if preferred.
export default prisma;
