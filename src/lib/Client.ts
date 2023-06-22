import { container, LogLevel, SapphireClient } from '@sapphire/framework'
import { env } from './environment'
import { PrismaClient } from '@prisma/client'
import { Redis } from 'ioredis'

export class UserClient extends SapphireClient {
	public constructor() {
		super( {
			defaultPrefix: env.DISCORD_PREFIX ?? '!',
			intents: [],
			loadDefaultErrorListeners: true,
			logger: {
				level: LogLevel.Info
			}
		} )
		container.prisma = new PrismaClient()
		container.redis = new Redis( {
			db: env.REDIS_DB,
			host: env.REDIS_HOST,
			password: env.REDIS_PASSWORD,
			port: env.REDIS_PORT,
			username: env.REDIS_USERNAME
		} )
	}

	public async start(): Promise<void> {
		await this.login( env.DISCORD_TOKEN )
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		prisma: PrismaClient
		redis: Redis
	}
}
