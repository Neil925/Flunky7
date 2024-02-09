interface LangaugeConfig {
    interactions: BotInteraction[];
    selectionPlaceHolder: string;
    rules: string[];
}

interface BotInteraction {
    prompt: string;
    responses: BotResponse[];
}

interface BotResponse {
    content: string;
    role: string;
    emoji?: string;
}

interface CommandInterface {
    public async action: (message: Discord.Message) => { } 
}

interface InteractionInterface {
    interactionType: InteractionType;
    componentTeype: ComponentType;
    public async action(interact: Interaction);
}

interface ongoingData {
    type: ongoingType;
    customIndex: number;
    addRoles?: String[];
    removeRoles?: String[];
}

enum ongoingType {
    language,
    secondaryLanguage,
    custom,
    rules
}

interface ongoing {
    userId: string;
    data: ongoingData;
}