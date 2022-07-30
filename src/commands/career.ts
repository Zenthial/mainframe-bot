import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageButton, } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { createCareerEmbed, createLogsEmbed } from "../functions/createCareerEmbed";
import { BPLog, getUserInfo } from "../functions/userInfoRequests";
import { checkVerified } from "../functions/verificationRequests";
import { SlidingView } from "../util/sliding_view";

export class Command {
    static data = new SlashCommandBuilder()
        .setName("career")
        .setDescription("replies with your user info or looks up a specified user!")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("the user to lookup")
                .setRequired(false)
        )

    static execute = async function (interaction: CommandInteraction) {
        const user = interaction.options.getUser("user");
        let userId = -1;

        if (user) {
            userId = await checkVerified(user.id);

            if (userId == -1) {
                return await interaction.reply({ content: `${user.toString()} is not verified. have them run /wij-verify on their account` }) // need to add a reverify feature
            }
        } else {
            userId = await checkVerified(interaction.member?.user.id);
        }

        if (userId == -1) {
            return await interaction.reply({ content: "please run /wij-verify to register your account", ephemeral: true }) // need to add a reverify feature
        } else {
            let userInfo = await getUserInfo(userId);

            if (userInfo != null) {
                let careerEmbed = await createCareerEmbed(userInfo);

                let logs_view = new SlidingView<BPLog>(userInfo.bp_logs);
                let log_page = 1;
                let max_pages = logs_view.len()
                let logsEmbed = await createLogsEmbed(userInfo, logs_view, true);
                logsEmbed.setFooter({ text: `Page ${log_page}/${max_pages}`, iconURL: "https://tr.rbxcdn.com/06438e6203c5f222fe47d45e9e6941e2/150/150/Image/Png" })


                let logsButton = new MessageButton().setCustomId("logs").setLabel("LOGS").setStyle(MessageButtonStyles.PRIMARY)
                let primaryRow = new MessageActionRow()
                    .addComponents([logsButton]);

                const logsFilter = (i: { customId: string; user: { id: string } }) => i.customId === "logs" && i.user.id === interaction.user.id;
                const logsCollector = interaction.channel?.createMessageComponentCollector({ filter: logsFilter, time: 60000 })

                let forwardButton = new MessageButton().setCustomId("next").setLabel("NEXT").setStyle(MessageButtonStyles.PRIMARY)
                let backwardButton = new MessageButton().setCustomId("back").setLabel("BACK").setStyle(MessageButtonStyles.PRIMARY).setDisabled(true)
                let infoButton = new MessageButton().setCustomId("info").setLabel("INFO").setStyle(MessageButtonStyles.SECONDARY)
                let infoRow = new MessageActionRow()
                    .addComponents([infoButton, backwardButton, forwardButton]);

                const forwardFilter = (i: { customId: string; user: { id: string } }) => i.customId === "next" && i.user.id === interaction.user.id;
                const backwardFilter = (i: { customId: string; user: { id: string } }) => i.customId === "back" && i.user.id === interaction.user.id;
                const infoFilter = (i: { customId: string; user: { id: string } }) => i.customId === "info" && i.user.id === interaction.user.id;
                const forwardCollector = interaction.channel?.createMessageComponentCollector({ filter: forwardFilter, time: 60000 })
                const backwardCollector = interaction.channel?.createMessageComponentCollector({ filter: backwardFilter, time: 60000 })
                const infoCollector = interaction.channel?.createMessageComponentCollector({ filter: infoFilter, time: 60000 })

                if (log_page == max_pages) {
                    forwardButton.setDisabled(true)
                } else if (log_page > max_pages) {
                    logsButton.setDisabled(true)
                }

                logsCollector?.on("collect", async i => {
                    await i.update({ embeds: [logsEmbed], components: [infoRow] })
                })

                forwardCollector?.on("collect", async i => {
                    log_page++;

                    logsEmbed = await createLogsEmbed(userInfo!, logs_view, true);
                    logsEmbed.setFooter({ text: `Page ${log_page}/${max_pages}`, iconURL: "https://tr.rbxcdn.com/06438e6203c5f222fe47d45e9e6941e2/150/150/Image/Png" })

                    backwardButton.setDisabled(false)
                    if (log_page >= max_pages) {
                        forwardButton.setDisabled(true)
                    }

                    await i.update({ embeds: [logsEmbed], components: [infoRow] })
                })

                backwardCollector?.on("collect", async i => {
                    log_page--;

                    logsEmbed = await createLogsEmbed(userInfo!, logs_view, false);
                    logsEmbed.setFooter({ text: `Page ${log_page}/${max_pages}`, iconURL: "https://tr.rbxcdn.com/06438e6203c5f222fe47d45e9e6941e2/150/150/Image/Png" })

                    forwardButton.setDisabled(false)
                    if (log_page <= 1) {
                        backwardButton.setDisabled(true)
                    }

                    await i.update({ embeds: [logsEmbed], components: [infoRow] })
                })

                infoCollector?.on("collect", async i => {
                    await i.update({ embeds: [careerEmbed], components: [primaryRow] })
                })

                return await interaction.reply({ embeds: [careerEmbed], components: [primaryRow] })
            } else {
                return await interaction.reply({ content: "failed to get userInfo", ephemeral: true })
            }
        }
    }
}