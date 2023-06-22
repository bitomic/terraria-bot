import { ScheduledTask, type ScheduledTaskOptions } from '@sapphire/plugin-scheduled-tasks'
import { ApplyOptions } from '@sapphire/decorators'
import type { APIMessage, APIReaction, MessageReaction } from 'discord.js'
import { env } from '../lib'

@ApplyOptions<ScheduledTaskOptions>( {
	name: 'count'
} )
export class UserTask extends ScheduledTask {
	public async run( event: APIReaction & { messageId: string; emojiId: { name: string }; users: string[] } | APIMessage ): Promise<void> {
		this.container.logger.info( 'Count:', event )
		const channel = await this.container.client.channels.fetch( env.DISCORD_TRIVIA_CHANNEL )
		if ( !channel?.isTextBased() ) return
		const messageId = 'me' in event ? event.messageId : event.id
		const message = await channel.messages.fetch( messageId )

		const { redis } = this.container
		const upvotesKey = `terraria:upvotes/${ message.id }`
		const downvotesKey = `terraria:downvotes/${ message.id }`

		const upvotes = await this.getReactionUsers( message.reactions.resolve( '👍' ) )
		const downvotes = await this.getReactionUsers( message.reactions.resolve( '👎' ) )
		this.container.logger.info( { downvotes, upvotes } )
		if ( upvotes.length ) {
			await redis.sadd( upvotesKey, ...upvotes )
		}
		if ( downvotes.length ) {
			await redis.sadd( downvotesKey, ...downvotes )
		}
	}

	public async getReactionUsers( reaction: MessageReaction | null ): Promise<string[]> {
		if ( !reaction ) return []
		const users = await reaction.users.fetch()
		return [ ...users.filter( user => !user.bot ).keys() ]
	}
}

declare module '@sapphire/plugin-scheduled-tasks' {
    interface ScheduledTasks {
        count: never
    }
}
