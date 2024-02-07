import fs from 'fs';
import { ActionRowBuilder, ChannelType, Client, ComponentType, Events, GatewayIntentBits, Guild, GuildMember, InteractionType, MessageActionRowComponentBuilder, OverwriteType, PermissionFlagsBits, PermissionsBitField } from 'discord.js';
import config from '../configs/config.json' with { type: "json" };
import { onButtonPress, onStringSelect } from './interact.js';
import { createStringMenu, defaultLangaugeConfig } from './helpers.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once(Events.ClientReady, async readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    let guild = await client.guilds.fetch("1204145479290462320");
    await welcomeMessage(guild, await guild.members.fetch("405283740533915649"));
});

client.on(Events.GuildMemberAdd, async member => await welcomeMessage(member.guild, member));

client.on(Events.InteractionCreate, async interact => {
    if (interact.type != InteractionType.MessageComponent)
        return;

    //if langauge
    if (interact.componentType == ComponentType.StringSelect)
        await onStringSelect(interact);
    else if (interact.componentType == ComponentType.Button)
        await onButtonPress(interact);
});

async function welcomeMessage(guild: Guild, member: GuildMember) {
    let allows = new PermissionsBitField(PermissionFlagsBits.ViewChannel).add(PermissionFlagsBits.SendMessages);

    let channel = await guild.channels.create({
        name: "Welcome",
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                allow: allows,
                id: client.user!.id,
                type: OverwriteType.Member,
            },
            {
                allow: allows,
                id: member.id,
                type: OverwriteType.Member,
            },
            {
                deny: PermissionFlagsBits.ViewChannel,
                id: guild.roles.everyone,
                type: OverwriteType.Member,
            },
        ]
    });

    const options: BotResponse[] = config.Languages.map(x => { return { content: x.ShownAs, role: x.RoleID, emoji: x.Emoji } });
    const select = createStringMenu(`Language ${member.id}`, 1, config.Languages.length, options);

    const row = new ActionRowBuilder().addComponents(select) as ActionRowBuilder<MessageActionRowComponentBuilder>;

    let langMessage = `<@!${member.id}>!\n\n ${config.Languages.map(x => x.languagePrompt).join('\n')}`;
    await channel.send({ content: langMessage, components: [row] });
}

for (const language of config.Languages) {
    if (!fs.existsSync(`configs/${language.Name}-config.json`))
        fs.writeFileSync(`configs/${language.Name}-config.json`, JSON.stringify(defaultLangaugeConfig), { flag: 'w' });
}

// Log in to Discord with your client's token
client.login(config.token);