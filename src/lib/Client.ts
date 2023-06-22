import { container, LogLevel, SapphireClient } from '@sapphire/framework'
import { env } from './environment'
import { PrismaClient } from '@prisma/client'

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
	}

	public async start(): Promise<void> {
		await this.login( env.DISCORD_TOKEN )
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		prisma: PrismaClient
	}
}
