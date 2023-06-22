import { InteractionHandler, type InteractionHandlerOptions, InteractionHandlerTypes } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { ActionRowBuilder, ButtonBuilder, type ButtonInteraction, ButtonStyle, ChannelType, EmbedBuilder } from 'discord.js'
import { env } from '../lib'

@ApplyOptions<InteractionHandlerOptions>( {
	interactionHandlerType: InteractionHandlerTypes.Button
} )
export class UserHandler extends InteractionHandler {
	public override parse( interaction: ButtonInteraction ) {
		if ( interaction.customId === 'approve' || interaction.customId === 'decline' ) return this.some()
		return this.none()
	}

	public async run( interaction: ButtonInteraction ) {
		await interaction.deferReply( { ephemeral: true } )
		const msg = await interaction.message.fetch()
		const embed = msg.embeds.at( 0 )
		if ( !embed ) return

		if ( interaction.customId === 'decline' ) {
			void msg.edit( {
				components: [],
				embeds: [ EmbedBuilder.from( embed )
					.setColor( 0xff3564 )
					.setFooter( {
						iconURL: interaction.user.avatarURL() || '',
						text: `Rechazada por ${ interaction.user.tag }`
					} ) ]
			} )
			void interaction.editReply( 'Has rechazado la curiosidad.' )
			return
		}

		const triviaChannel = await this.container.client.channels.fetch( env.DISCORD_TRIVIA_CHANNEL )
		if ( triviaChannel?.type !== ChannelType.GuildText ) return

		void msg.edit( {
			components: [],
			embeds: [ EmbedBuilder.from( embed )
				.setFooter( {
					iconURL: interaction.user.avatarURL() || '',
					text: `Aprobado por ${ interaction.user.tag }`
				} ) ]
		} )
		const trivia = await triviaChannel.send( {
			embeds: [ embed ]
		} )
		void interaction.editReply( {
			components: [ new ActionRowBuilder<ButtonBuilder>()
				.addComponents( new ButtonBuilder()
					.setLabel( 'Ir al mensaje' )
					.setStyle( ButtonStyle.Link )
					.setURL( trivia.url ) ) ],
			content: 'Has aprobado la curiosidad.'
		} )
		await trivia.react( '👍' )
		await trivia.react( '👎' )

		await this.container.prisma.triviaStats.update( {
			data: {
				channel: triviaChannel.id,
				message: trivia.id
			},
			where: {
				message: interaction.message.id
			}
		} )
	}
}
