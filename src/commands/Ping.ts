import { type ApplicationCommandRegistry, Command, type CommandOptions, RegisterBehavior } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import type { CommandInteraction } from 'discord.js'
import { env } from '../lib'

@ApplyOptions<CommandOptions>( {
	description: 'Pong!',
	enabled: true,
	name: 'ping'
} )
export class UserCommand extends Command {
	public override registerApplicationCommands( registry: ApplicationCommandRegistry ): void {
		registry.registerChatInputCommand(
			builder => builder
				.setName( this.name )
				.setDescription( this.description ),
			{
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				guildIds: [ env.DISCORD_DEVELOPMENT_SERVER ]
			}
		)
	}

	public override chatInputRun( interaction: CommandInteraction ): void {
		void interaction.reply( 'Pong!' )
	}
}
