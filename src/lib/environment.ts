import { load } from 'ts-dotenv'

export const env = load( {
	DISCORD_DEVELOPMENT_SERVER: String,
	DISCORD_OWNER: String,
	DISCORD_PREFIX: {
		optional: true,
		type: String
	},
	DISCORD_REVIEW_CHANNEL: String,
	DISCORD_TOKEN: String,
	DISCORD_TRIVIA_CHANNEL: String,
	NODE_ENV: [
		'development' as const,
		'production' as const
	],
	REDIS_DB: Number,
	REDIS_HOST: String,
	REDIS_PASSWORD: String,
	REDIS_PORT: {
		default: 6379,
		type: Number
	},
	REDIS_USERNAME: String
} )
