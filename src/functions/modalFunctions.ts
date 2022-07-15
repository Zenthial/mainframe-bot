import { ModalSubmitInteraction } from "discord.js";
import { incrementPoints } from "./userInfoRequests";

interface PointsUserPayload {
    username: string,
    increment: number,
    add_event: boolean,
}

export async function userInputModelFunction(interaction: ModalSubmitInteraction, points: number, addEvent: boolean) {
    await interaction.deferReply()
    let usersString = interaction.fields.getTextInputValue("userInput")
    let usersSplit = usersString.split(",")

    let usersArray = new Array<PointsUserPayload>();
    for (let value of usersSplit) {
        let user = value.trim()
        usersArray.push({
            username: user,
            increment: points,
            add_event: addEvent
        })
    }

    let returnString = await incrementPoints(usersArray);
    await interaction.editReply(returnString)
}