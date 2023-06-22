import { Listener, type ListenerOptions } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { Events, type MessageReaction, type User } from 'discord.js'
import { env } from '../lib'

@ApplyOptions<ListenerOptions>( {
	event: Events.MessageReactionAdd
} )
export class UserEvent extends Listener {
	public run( reaction: MessageReaction, user: User ): void {
		if ( user.bot ) return
		if ( reaction.message.channelId !== env.DISCORD_TRIVIA_CHANNEL ) return
		const emoji = reaction.emoji.name
		if ( emoji !== '👍' && emoji !== '👎' ) return

		void this.container.tasks.create( 'count', reaction )
	}
}
