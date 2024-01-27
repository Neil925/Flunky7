import fs from 'fs';
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember, Message, MessageActionRowComponentBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";
import config from '../configs/config.json' with { type: "json" };

export async function onStringSelect(interact: StringSelectMenuInteraction) {
    if (!interact.customId.includes(interact.user.id) || !interact.guild)
        return;

    let guildUser = await interact.guild.members.fetch(interact.user);

    for (const roleId of interact.values)
        await guildUser.roles.add(roleId);

    await interact.update(await nextInteraction(interact.customId, interact.message, guildUser));
}

export async function onButtonPress(interact: ButtonInteraction) {
    if (!interact.guild)
        return;

    let guildUser = await interact.guild.members.fetch(interact.user);

    if (interact.customId == "reject") {
        for (const role of guildUser.roles.cache)
            await guildUser.roles.remove(role);

        guildUser.roles.add(config.prisonRole);
    }

    await interact.update({content: "🤗", components: []});

    setTimeout(async () => await interact.channel?.delete(), 3000);
}

async function nextInteraction(customId: string, message: Message<boolean>, guildUser: GuildMember) {
    let interactionNum = 0;

    if (!customId.includes("Language"))
        interactionNum = parseInt(customId.split(' ')[0]);

    let languageConfig = await getLanguageConfig(guildUser);

    let interact = languageConfig.interactions.at(interactionNum);

    if (interact) {
        const select = new StringSelectMenuBuilder()
            .setCustomId(`${++interactionNum} ${guildUser.id}`)
            .setPlaceholder(languageConfig.selectionPlaceHolder)
            .setMinValues(0)
            .setMaxValues(interact.responses.length)
            .addOptions(interact.responses.map(x => {
                let b = new StringSelectMenuOptionBuilder()
                    .setLabel(x.content)
                    .setDescription(`<@${x.role}>`)
                    .setValue(x.role);
                if (x.emoji)
                    b.setEmoji(x.emoji);
                return b;
            }));

        const row = new ActionRowBuilder().addComponents(select) as ActionRowBuilder<MessageActionRowComponentBuilder>;

        return { content: interact.prompt, components: [row] };
    }

    const confirm = new ButtonBuilder()
        .setCustomId('accept')
        .setLabel('✅')
        .setStyle(ButtonStyle.Success);

    const cancel = new ButtonBuilder()
        .setCustomId('reject')
        .setLabel('❌')
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
        .addComponents(confirm)
        .addComponents(cancel) as ActionRowBuilder<MessageActionRowComponentBuilder>;

    return { content: languageConfig.rules.join('\n'), components: [row] };
}

async function getLanguageConfig(guildUser: GuildMember) {
    let language = config.Languages.find(x => guildUser.roles.cache.some(r => r.id.includes(x.RoleID)));
    if (!language)
        throw new Error(`${guildUser.user.tag} does not have a valid language role!`);

    return JSON.parse(fs.readFileSync(`configs/${language.Name}-config.json`, { encoding: "utf-8" })) as LangaugeConfig;
}