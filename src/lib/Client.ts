import { LogLevel, SapphireClient } from '@sapphire/framework'
import { env } from './environment'

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
	}

	public async start(): Promise<void> {
		await this.login( env.DISCORD_TOKEN )
	}
}
