import { type ApplicationCommandRegistry, Command, type CommandOptions, RegisterBehavior } from '@sapphire/framework'
import { ApplyOptions } from '@sapphire/decorators'
import { type CommandInteraction, EmbedBuilder, hyperlink, messageLink } from 'discord.js'
import { env } from '../../lib'

@ApplyOptions<CommandOptions>( {
	description: 'Consulta las estadísticas de curiosidades de alguien.',
	enabled: true,
	name: 'stats'
} )
export class UserCommand extends Command {
	public override registerApplicationCommands( registry: ApplicationCommandRegistry ): void {
		registry.registerChatInputCommand(
			builder => builder
				.setName( this.name )
				.setDescription( this.description )
				.addUserOption( input => input
					.setName( 'usuario' )
					.setDescription( 'Usuario a consultar.' ) ),
			{
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
				guildIds: [ env.DISCORD_DEVELOPMENT_SERVER ]
			}
		)
	}

	public override async chatInputRun( interaction: CommandInteraction ): Promise<void> {
		await interaction.deferReply()

		const user = interaction.options.getUser( 'usuario' ) ?? interaction.user
		const entries = await this.container.prisma.triviaStats.findMany( {
			where: {
				channel: env.DISCORD_TRIVIA_CHANNEL,
				user: user.id
			}
		} )

		const embed = new EmbedBuilder()
			.setColor( 0x1b9946 )
			.setAuthor( {
				iconURL: user.avatarURL( { extension: 'png' } ) ?? '',
				name: user.username
			} )
			.setTitle( 'Estadísticas de curiosidades' )

		if ( !entries.length ) {
			embed.setDescription( `Parece que no tengo registrada ninguna curiosidad tuya. Recuerda que puedes proponer curiosidades usando el comando </curiosidad:1107384091113967657>, y si es aprobada por los administradores, aparecerá en <#${ env.DISCORD_TRIVIA_CHANNEL }>.` )
			void interaction.editReply( {
				embeds: [ embed ]
			} )
			return
		}

		const list: string[] = []
		for ( const item of entries ) {
			const message = messageLink( item.channel, item.message )
			const link = hyperlink( item.message, message )
			const upvotes = await this.container.redis.scard( `terraria:upvotes/${ item.message }` )
			const downvotes = await this.container.redis.scard( `terraria:downvotes/${ item.message }` )
			const text = `**${ link }** 👍 ${ upvotes } / ${ downvotes } 👎`
			list.push( text )
		}
		embed.setDescription( `Hasta la fecha, has enviado ${ entries.length } curiosidades que han sido aprobadas.\n\n${ list.join( '\n' ) }` )

		void interaction.editReply( {
			embeds: [ embed ]
		} )
	}
}
