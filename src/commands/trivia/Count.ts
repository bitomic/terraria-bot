import { type ApplicationCommandRegistry, Command, type CommandOptions, RegisterBehavior } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { ApplicationCommandType, type MessageContextMenuCommandInteraction, PermissionFlagsBits } from 'discord.js'
import { env } from '../../lib'

@ApplyOptions<CommandOptions>( {
	description: 'Consulta las estadísticas de curiosidades de alguien.',
	enabled: true,
	name: 'estadísticas'
} )
export class UserCommand extends Command {
	public override registerApplicationCommands( registry: ApplicationCommandRegistry ): void {
		registry.registerContextMenuCommand(
			builder => builder
				.setDMPermission( false )
				.setDefaultMemberPermissions( PermissionFlagsBits.Administrator )
				.setName( 'Recontar' )
				.setType( ApplicationCommandType.Message ),
			{
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				guildIds: [ env.DISCORD_DEVELOPMENT_SERVER ]
			}
		)
	}

	public override contextMenuRun( interaction: MessageContextMenuCommandInteraction ): void {
		if ( interaction.user.id !== env.DISCORD_OWNER ) {
			void interaction.reply( {
				content: 'No puedes usar este comando.',
				ephemeral: true
			} )
			return
		}

		const message = interaction.targetId
		void this.container.tasks.create( 'count', { id: message } )
		void interaction.reply( {
			content: 'El mensaje será registrado en unos momentos.',
			ephemeral: true
		} )
	}
}
