import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { Client, Collection, Intents } from "discord.js"
import dotenv from "dotenv"
import fs from "node:fs"
import path from "node:path"
import { CommandInterface } from "./types/CommandInterface"

const commands = new Array();
const commandsCollection = new Collection<string, CommandInterface>();
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

// Place your client and guild ids here
const clientId = "748886624586432532";
const guildId = "136517364446527489";

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command: CommandInterface = require(filePath).Command;
    commands.push(command.data.toJSON());
    commandsCollection.set(command.data.name, command)
}

dotenv.config()
const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.on("ready", () => {
    console.log(`Client logged in`)
})

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = commandsCollection.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
})

client.login(process.env.DISCORD_TOKEN)