import { ScheduledTask, type ScheduledTaskOptions } from '@sapphire/plugin-scheduled-tasks'
import { ApplyOptions } from '@sapphire/decorators'
import { type Message, MessageReaction } from 'discord.js'
import { env } from '../lib'

@ApplyOptions<ScheduledTaskOptions>( {
	name: 'count'
} )
export class UserTask extends ScheduledTask {
	public async run( event: MessageReaction | Message ): Promise<void> {
		const channel = await this.container.client.channels.fetch( env.DISCORD_TRIVIA_CHANNEL )
		if ( !channel?.isTextBased() ) return
		const messageId = event instanceof MessageReaction ? event.message.id : event.id
		const message = await channel.messages.fetch( messageId )

		const { redis } = this.container
		const upvotesKey = `terraria:upvotes/${ message.id }`
		const downvotesKey = `terraria:downvotes/${ message.id }`
		const exists = await redis.exists( upvotesKey, downvotesKey )

		if ( exists && event instanceof MessageReaction ) {
			const isUpvote = event.emoji.name === '👍'
			const key = isUpvote ? upvotesKey : downvotesKey
			await redis.sadd( key, message.author.id )
		} else if ( !exists ) {
			const upvotes = await this.getReactionUsers( message.reactions.resolve( '👍' ) )
			const downvotes = await this.getReactionUsers( message.reactions.resolve( '👎' ) )
			if ( upvotes.length ) {
				await redis.sadd( upvotesKey, ...upvotes )
			}
			if ( downvotes.length ) {
				await redis.sadd( downvotesKey, ...downvotes )
			}
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
