import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { getUserInfo } from "../user_info_requests.js";
import { checkVerified } from "../verification_requests.js";

export class Command {
    static data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('get-roles')
        .setDescription('attempts to verify you in the WIJ Mainframe database')

    static execute = async function (interaction: CommandInteraction) {
        let userId = await checkVerified(interaction.member?.user.id);

        if (userId == -1) {
            await interaction.reply({ content: "please run /verify to register your account", ephemeral: true }) // need to add a reverify feature
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

                    await interaction.reply({ content: return_str, ephemeral: true })
                } else {
                    await interaction.reply({ content: `unable to add rank role for rank ${userInfo.rank}`, ephemeral: true })
                }
            }
        }
    }
}