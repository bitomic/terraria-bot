import { InteractionHandler, type InteractionHandlerOptions, InteractionHandlerTypes } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, type ModalSubmitInteraction } from 'discord.js'
import { env } from '../lib'

@ApplyOptions<InteractionHandlerOptions>( {
	interactionHandlerType: InteractionHandlerTypes.ModalSubmit
} )
export class UserHandler extends InteractionHandler {
	public override parse( interaction: ModalSubmitInteraction ) {
		if ( interaction.customId !== 'trivia' ) return this.none()
		return this.some()
	}

	public async run( interaction: ModalSubmitInteraction ) {
		const reviewChannel = await this.container.client.channels.fetch( env.DISCORD_REVIEW_CHANNEL )
		if ( reviewChannel?.type !== ChannelType.GuildText ) return

		const embed = new EmbedBuilder()
			.setAuthor( {
				iconURL: interaction.user.avatarURL() || '',
				name: interaction.user.username
			} )
			.setColor( 0x1b9946 )
			.setDescription( interaction.fields.getTextInputValue( 'content' ) )
		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId( 'approve' )
					.setLabel( 'Aprobar' )
					.setStyle( ButtonStyle.Success ),
				new ButtonBuilder()
					.setCustomId( 'decline' )
					.setLabel( 'Rechazar' )
					.setStyle( ButtonStyle.Danger )
			)
		const message = await reviewChannel.send( {
			components: [ row ],
			embeds: [ embed ]
		} )
		await this.container.prisma.triviaStats.create( {
			data: {
				channel: reviewChannel.id,
				message: message.id,
				user: interaction.user.id
			}
		} )

		void interaction.reply( {
			content: '¡Gracias por tu aportación! Los moderadores la revisarán antes de publicarla.',
			ephemeral: true
		} )
	}
}
