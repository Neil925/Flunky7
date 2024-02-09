import { ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, GuildMember, MessageActionRowComponentBuilder, RestOrArray, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import config from '../configs/config.json' with { type: "json" };
import fs from 'fs';

let ongoingInteractions: ongoing[] = [];

export const addInteraction = (userid: string) =>
    ongoingInteractions.push({ userId: userid, data: { type: ongoingType.language, customIndex: -1, addRoles: [] } });

export const interactionAddRoles = (userid: string, role: string) =>
    ongoingInteractions[ongoingInteractions.findIndex(x => x.userId == userid)].data.addRoles?.push(role);

export const interactionRemoveRoles = (userid: string, role: string) =>
    ongoingInteractions[ongoingInteractions.findIndex(x => x.userId == userid)].data.removeRoles?.push(role);

export const returnInteraction = (userid: string, remove: boolean = false) => {
    let index = ongoingInteractions.findIndex(x => x.userId == userid);
    let result = ongoingInteractions[index];

    if (remove)
        ongoingInteractions.splice(index);

    return result;
}

export const defaultLangaugeConfig = {
    languagePrompt: "<Please select your langauges.>",
    selectionPlaceHolder: "<Make a selection...>",
    interactions: [
        {
            prompt: "<What are your interests?>",
            responses: [
                {
                    content: "Gaming",
                    role: "roleidhere",
                    emoji: "🎮"
                },
                {
                    content: "Art",
                    role: "roleidhere",
                    emoji: "🖌️"
                },
                {
                    content: "Anime",
                    role: "roleidhere",
                    emoji: "🥷"
                },
                {
                    content: "Music",
                    role: "roleidhere",
                    emoji: "🎵"
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

export const createActionRow = (component: AnyComponentBuilder[]) =>
    new ActionRowBuilder().addComponents(component) as ActionRowBuilder<MessageActionRowComponentBuilder>;

export const createButton = (customId: string, label: string, style: ButtonStyle) =>
    new ButtonBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style);

export const createStringMenu = (customId: string, minVal: number, maxVal: number, responses: BotResponse[], placeHolder?: string) =>
    new StringSelectMenuBuilder()
        .setCustomId(customId)
        .setPlaceholder(placeHolder ?? "Select...")
        .setMinValues(minVal)
        .setMaxValues(maxVal)
        .addOptions(responses.map(x => {
            let val = new StringSelectMenuOptionBuilder()
                .setLabel(x.content)
                .setDescription(`<@${x.role}>`)
                .setValue(x.role);

            if (x.emoji)
                val.setEmoji(x.emoji);

            return val;
        }));

export const getLanguageConfig = async (guildUser: GuildMember) => {
    let language = config.Languages.find(x => guildUser.roles.cache.some(r => r.id.includes(x.RoleID)));
    if (!language)
        throw new Error(`${guildUser.user.tag} does not have a valid language role!`);

    return JSON.parse(fs.readFileSync(`configs/${language.Name}-config.json`, { encoding: "utf-8" })) as LangaugeConfig;
}

export const loadLanguageConfigs = () => {
    for (const language of config.Languages) {
        if (!fs.existsSync(`configs/${language.Name}-config.json`))
            fs.writeFileSync(`configs/${language.Name}-config.json`, JSON.stringify(defaultLangaugeConfig), { flag: 'w' });
    }
}