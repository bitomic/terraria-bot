import { Listener, type ListenerOptions } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<ListenerOptions>( {
	event: 'ready',
	once: true
} )
export class UserEvent extends Listener {
	public run(): void {
		this.container.logger.info( `Ready! as ${ this.container.client.user?.tag ?? 'unknown user' }` )

		void this.container.tasks.create( 'init' )
	}
}
