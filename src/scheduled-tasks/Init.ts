import { ScheduledTask, type ScheduledTaskOptions } from '@sapphire/plugin-scheduled-tasks'
import { ApplyOptions } from '@sapphire/decorators'
import { env } from '../lib'

@ApplyOptions<ScheduledTaskOptions>( {
	name: 'init'
} )
export class UserTask extends ScheduledTask {
	public async run(): Promise<void> {
		const channel = await this.container.client.channels.fetch( env.DISCORD_TRIVIA_CHANNEL )
		if ( !channel?.isTextBased() ) return

		const messages = await channel.messages.fetch()
		for ( const message of messages ) {
			await this.container.tasks.create( 'count', message[ 1 ] )
		}
	}
}

declare module '@sapphire/plugin-scheduled-tasks' {
    interface ScheduledTasks {
        init: never
    }
}
