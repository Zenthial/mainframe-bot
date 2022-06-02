import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { Collection } from "discord.js"
import fs from "node:fs"
import path from "node:path"
import { CLIENT_ID, DISCORD_TOKEN, GUILD_ID } from "./secrets.js"
import { CommandInterface } from "./types/command_interface.js"

export async function load_slash_commands(): Promise<Collection<string, CommandInterface>> {
    const commands = new Array();
    const commandsCollection = new Collection<string, CommandInterface>();
    const commandsPath = path.join(__dirname, 'commands')
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath).Command;
        console.log(command)
        commands.push(command.data.toJSON());
        commandsCollection.set(command.data.name, command)
    }

    const rest = new REST().setToken(DISCORD_TOKEN);

    await (async () => {
        try {
            console.log("Started refreshing application (/) commands.");

            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
                { body: commands },
            );

            console.log("Successfully reloaded application (/) commands.");
        } catch (error) {
            console.error(error);
        }
    })();

    return commandsCollection
}