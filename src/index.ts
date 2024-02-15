import { Client, ComponentType, Events, GatewayIntentBits, InteractionType } from 'discord.js';
import config from '../configs/config.json' with { type: "json" };
import { loadLanguageConfigs } from './helpers.js';
import RoleTransactionHandler from './roleTransactionHandler.js';
import fs from 'fs';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
export const transactionHandler = new RoleTransactionHandler();

client.once(Events.ClientReady, async readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    let guild = await client.guilds.fetch("1204145479290462320");
    await RoleTransactionHandler.initiate(client, guild, await guild.members.fetch("405283740533915649"));
});

client.on(Events.GuildMemberAdd, async member => await RoleTransactionHandler.initiate(client, member.guild, member));

import base from "./componentInteraction/base.js";
const baseFile = "base.ts";
import path from 'path';

let basedir = import.meta.filename;
basedir = basedir.substring(0, basedir.lastIndexOf('/'));

console.debug(basedir);

const readCommands = (dir: string) => {
    const files = fs.readdirSync(path.join(basedir, dir));
    for (const file of files) {
        const stat = fs.lstatSync(path.join(basedir, dir, file));
        if (stat.isDirectory()) {
            readCommands(path.join(dir, file));
        } else if (file !== baseFile) {
            const option = require(path.join(basedir, dir, file));
            base(client, option);
        }
    }
}

readCommands('componentInteraction');

loadLanguageConfigs();

client.login(config.token);