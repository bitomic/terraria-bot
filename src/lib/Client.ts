import { container, LogLevel, SapphireClient } from '@sapphire/framework'
import { env } from './environment'
import { PrismaClient } from '@prisma/client'
import { Redis } from 'ioredis'
import { IntentsBitField, Partials } from 'discord.js'

export class UserClient extends SapphireClient {
	public constructor() {
		const redis = new Redis( {
			db: env.REDIS_DB,
			host: env.REDIS_HOST,
			maxRetriesPerRequest: null,
			password: env.REDIS_PASSWORD,
			port: env.REDIS_PORT,
			username: env.REDIS_USERNAME
		} )

		super( {
			defaultPrefix: env.DISCORD_PREFIX ?? '!',
			intents: new IntentsBitField( [ 'Guilds', 'GuildMessages', 'GuildMessageReactions' ] ),
			loadDefaultErrorListeners: true,
			logger: {
				level: LogLevel.Info
			},
			partials: [ Partials.Message, Partials.Reaction, Partials.User ],
			tasks: {
				bull: {
					connection: redis,
					defaultJobOptions: {
						removeOnComplete: true,
						removeOnFail: true
					}
				}
			}
		} )
		container.prisma = new PrismaClient()
		container.redis = redis
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
