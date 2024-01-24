import fs from 'fs';
import { ActionRowBuilder, ChannelType, Client, ComponentType, Events, GatewayIntentBits, InteractionType, MessageActionRowComponentBuilder, OverwriteType, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import config from '../configs/config.json' with { type: "json" };
import { onButtonPress, onStringSelect } from './interact.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
const defaultLangaugeConfig = {
    languagePrompt: "<Please select your langauges.>",
    selectionPlaceHolder: "<Make a selection...>",
    interactions: [
        {
            prompt: "<What are your interests?>",
            responses: [
                {
                    content: "Gaming",
                    role: "roleidhere"
                },
                {
                    content: "Art",
                    role: "roleidhere"
                },
                {
                    content: "Anime",
                    role: "roleidhere"
                },
                {
                    content: "Music",
                    role: "roleidhere"
                }
            ]
        }
    ],
    rules: [
        "Rule #1: Flunky7 is the best bot.",
        "Rule #2: You must praise Flunky7.",
        "Rule #3: Flunky7 will hunt down those who speak back.",
    ]
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.GuildMemberAdd, async member => {
    let guild = member.guild;

    let channel = await guild.channels.create({
        name: "Welcome!",
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                allow: PermissionFlagsBits.ViewChannel,
                id: member.id,
                type: OverwriteType.Member,
            },
            {
                allow: PermissionFlagsBits.SendMessages,
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

    const select = new StringSelectMenuBuilder()
        .setCustomId(`Language ${member.id}`)
        .setPlaceholder("Select...")
        .setMinValues(1)
        .setMaxValues(config.Languages.length)
        .addOptions(config.Languages.map(x => new StringSelectMenuOptionBuilder()
            .setLabel(x.ShownAs)
            .setDescription(`<@${x.RoleID}>`)
            .setValue(x.RoleID)));

    const row = new ActionRowBuilder().addComponents(select) as ActionRowBuilder<MessageActionRowComponentBuilder>;

    let langMessage = config.Languages.map(x => x.languagePrompt).join('\n');
    await channel.send({ content: langMessage, components: [row] });
})

client.on(Events.InteractionCreate, async interact => {
    if (interact.type != InteractionType.MessageComponent)
        return;

    //if langauge
    if (interact.componentType == ComponentType.StringSelect)
        await onStringSelect(interact);
    else if (interact.componentType == ComponentType.Button)
        await onButtonPress(interact);
});

for (const language of config.Languages) {
    if (!fs.existsSync(`configs/${language.Name}-config.json`))
        fs.writeFileSync(`configs/${language.Name}-config.json`, JSON.stringify(defaultLangaugeConfig), { flag: 'w' });
}

// Log in to Discord with your client's token
client.login(config.token);