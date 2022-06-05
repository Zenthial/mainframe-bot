import { ModalSubmitInteraction } from "discord.js";
import { addPoints, removePoints } from "./userInfoRequests";

export async function userInputModelFunction(interaction: ModalSubmitInteraction, points: number, addEvent: boolean) {
    let usersString = interaction.fields.getTextInputValue("userInput")
    let usersSplit = usersString.split(",")
    usersSplit.forEach(async (value, _) => {
        let user = value.trim()
        if (await addPoints(user, points, addEvent)) {
            await interaction.channel?.send(`added ${points} bP to ${user}`)
        } else {
            await interaction.channel?.send(`failed to add ${points} bP to ${user}`)
        }
    })

    await interaction.reply("processed request!")
}

export async function removePointsModalFunction(interaction: ModalSubmitInteraction, points: number) {
    let usersString = interaction.fields.getTextInputValue("userInput")
    let usersSplit = usersString.split(",")
    usersSplit.forEach(async (value, _) => {
        let user = value.trim()
        if (await removePoints(user, points)) {
            await interaction.channel?.send(`added ${points} bP to ${user}`)
        } else {
            await interaction.channel?.send(`failed to add ${points} bP to ${user}`)
        }
    })

    await interaction.reply("processed request!")
}