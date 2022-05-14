import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { getUserInfo } from "../user_info_requests.js";
import { checkVerified } from "../verification_requests.js";

export class Command {
    static data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('wij-verify')
        .setDescription('attempts to verify you in the WIJ Mainframe database')

    static execute = async function (interaction: CommandInteraction) {
        let userId = await checkVerified(interaction.member?.user.id);

        if (userId == -1) {
            await interaction.reply({ content: "please run /verify to register your account", ephemeral: true }) // need to add a reverify feature
        } else {
            let userInfo = await getUserInfo(userId);

            if (userInfo != null) {
                let rankRole = interaction.guild?.roles.cache.find(role => role.name === userInfo?.name)
                if (rankRole) {
                    let member = interaction.member as GuildMember
                    member.roles.add(rankRole);

                    await interaction.reply({ content: `added role ${rankRole.name}`, ephemeral: true })
                } else {
                    await interaction.reply({ content: `unable to add rank role for rank ${userInfo.rank}`, ephemeral: true })
                }
            }
        }
    }
}