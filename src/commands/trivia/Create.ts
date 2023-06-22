import { type ApplicationCommandRegistry, Command, type CommandOptions, RegisterBehavior } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { ActionRowBuilder, type CommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import { env } from '../../lib'

@ApplyOptions<CommandOptions>( {
	description: 'Comparte una curiosidad de Terraria.',
	enabled: true,
	name: 'curiosidad'
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
		const modal = new ModalBuilder()
			.setTitle( 'Enviar una curiosidad' )
			.setCustomId( 'trivia' )
			.addComponents( new ActionRowBuilder<TextInputBuilder>()
				.addComponents( new TextInputBuilder()
					.setCustomId( 'content' )
					.setLabel( 'Curiosidad' )
					.setMaxLength( 2000 )
					.setMinLength( 10 )
					.setRequired( true )
					.setStyle( TextInputStyle.Paragraph ) ) )
		void interaction.showModal( modal )
	}
}
