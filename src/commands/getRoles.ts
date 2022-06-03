import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { getUserInfo } from "../functions/userInfoRequests.js";
import { checkVerified } from "../functions/verificationRequests.js";

export class Command {
    static data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('get-roles')
        .setDescription('attempts to verify you in the WIJ Mainframe database')

    static execute = async function (interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true })
        let userId = await checkVerified(interaction.member?.user.id);

        if (userId == -1) {
            await interaction.editReply("please run /wij-verify to register your account") // need to add a reverify feature
        } else {
            let userInfo = await getUserInfo(userId);

            if (userInfo != null) {
                let rankRole = interaction.guild?.roles.cache.find(role => role.name === userInfo?.rank)
                let stRole = interaction.guild?.roles.cache.find(role => role.name == "Shock Trooper")
                let sableRole = interaction.guild?.roles.cache.find(role => role.name == "Sable")

                if (rankRole) {
                    let return_str = "";
                    let member = interaction.member as GuildMember

                    try {
                        await member.setNickname(userInfo.name);
                        return_str += `set nickname to ${userInfo.name}\n`
                    } catch (e) {
                        return_str += "failed to set nickname due to you having too high of a permission level\n"
                    }

                    if (!member.roles.cache.find(role => role.name == rankRole?.name)) {
                        try {
                            await member.roles.add(rankRole);
                            return_str += `added role ${rankRole.name}\n`
                        } catch (e) {
                            return_str += `failed to add role ${rankRole.name}\n`
                        }
                    }

                    if (userInfo.divisions != null) {
                        if (userInfo.divisions.st != null && stRole && !member.roles.cache.find(role => role.name == stRole?.name)) {
                            try {
                                await member.roles.add(stRole);
                                return_str += `added role ${stRole.name}\n`
                            } catch (e) {
                                return_str += `failed to add role ${stRole.name}\n`
                            }
                        }

                        if (userInfo.divisions.sable != null && sableRole && !member.roles.cache.find(role => role.name == sableRole?.name)) {
                            try {
                                await member.roles.add(sableRole)
                                return_str += `added role ${sableRole.name}\n`
                            } catch (e) {
                                return_str += `failed to add role ${sableRole.name}\n`
                            }
                        }
                    }


                    if (return_str === "") {
                        return_str = "no roles to add!"
                    }

                    await interaction.editReply(return_str)
                } else {
                    await interaction.editReply(`unable to add rank role for rank ${userInfo.rank}`)
                }
            }
        }
    }
}