import { ModalSubmitInteraction } from "discord.js";
import { incrementPoints } from "./userInfoRequests";

export interface PointsUserPayload {
    username: string,
    increment: number,
    add_event: boolean,
    admin_id: number,
}

export async function userInputModelFunction(interaction: ModalSubmitInteraction, points: number, user_id: number, addEvent: boolean) {
    await interaction.deferReply()
    let usersString = interaction.fields.getTextInputValue("userInput")
    let usersSplit = usersString.split(",")

    let usersArray = new Array<PointsUserPayload>();
    for (let value of usersSplit) {
        usersArray.push({
            username: value.trim(),
            increment: points,
            add_event: addEvent,
            admin_id: user_id
        })
    }

    let returnString

    if (addEvent) {
        let placeString = interaction.fields.getTextInputValue("placeInput")
        returnString = await incrementPoints(usersArray, placeString);
    } else {
        returnString = await incrementPoints(usersArray);
    }
    await interaction.editReply(returnString)
}