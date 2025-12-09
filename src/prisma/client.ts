
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'
import {ENV} from "../config/env.js";

const connectionString = `${ENV.DATABASE_URL}`

// In development (non-production) allow self-signed certificates so local
// connectivity to databases with self-signed certs doesn't fail. Do NOT enable
// this in production.
if (ENV.NODE_ENV !== 'production') {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter, log: ["query", "info", "warn", "error"]  })

export { prisma }
