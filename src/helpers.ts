import { GuildMember, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

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

export const createStringMenu = (customId: string, minVal: number, maxVal: number, responses: BotResponse[], placeHolder?: string) => {
    return new StringSelectMenuBuilder()
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
}

export const getLanguageConfig = async (guildUser: GuildMember) => {
    let language = config.Languages.find(x => guildUser.roles.cache.some(r => r.id.includes(x.RoleID)));
    if (!language)
        throw new Error(`${guildUser.user.tag} does not have a valid language role!`);

    return JSON.parse(fs.readFileSync(`configs/${language.Name}-config.json`, { encoding: "utf-8" })) as LangaugeConfig;
}