import { Listener, type ListenerOptions } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { Events, type MessageReaction, type User } from 'discord.js'
import { env } from '../lib'

@ApplyOptions<ListenerOptions>( {
	event: Events.MessageReactionRemove
} )
export class UserEvent extends Listener {
	public run( reaction: MessageReaction, user: User ): void {
		if ( user.bot ) return
		if ( reaction.message.channelId !== env.DISCORD_TRIVIA_CHANNEL ) return
		const emoji = reaction.emoji.name
		if ( emoji !== '👍' && emoji !== '👎' ) return

		const group = emoji === '👍' ? 'upvotes' : 'downvotes'
		const key = `terraria:${ group }/${ reaction.message.id }`
		void this.container.redis.srem( key, user.id )
	}
}
