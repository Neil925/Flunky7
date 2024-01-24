import fs from 'fs';
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember, Message, MessageActionRowComponentBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder } from "discord.js";
import config from '../configs/config.json' with { type: "json" };

export async function onStringSelect(interact: StringSelectMenuInteraction) {
    console.log(interact.customId);

    if (!interact.customId.includes(interact.user.id) || !interact.guild)
        return;

    let guildUser = await interact.guild.members.fetch(interact.user);

    for (const roleId of interact.values)
        await guildUser.roles.add(roleId);

    await nextInteraction(interact.customId, interact.message, guildUser);
}

export async function onButtonPress(interact: ButtonInteraction) {
    if (!interact.customId.includes(interact.user.id) || !interact.guild)
        return;

    let guildUser = await interact.guild.members.fetch(interact.user);

    if (interact.customId == "reject") {
        for (const role of guildUser.roles.cache)
            await guildUser.roles.remove(role);
     
        guildUser.roles.add(config.prisonRole);
    }
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
            .addOptions(interact.responses.map(x => new StringSelectMenuOptionBuilder()
                .setLabel(x.content)
                .setDescription(`<@${x.role}>`)
                .setValue(x.role)));

        const row = new ActionRowBuilder().addComponents(select) as ActionRowBuilder<MessageActionRowComponentBuilder>;

        await message.edit({ content: interact.prompt, components: [row] })
        return;
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

    await message.edit({ content: languageConfig.rules.join('\n'), components: [row] });
}

async function getLanguageConfig(guildUser: GuildMember) {
    let language = config.Languages.find(x => guildUser.roles.cache.some(r => r.id.includes(x.RoleID)));
    return JSON.parse(fs.readFileSync(`configs/${language}-config.json`, { encoding: "utf-8" })) as LangaugeConfig;
}