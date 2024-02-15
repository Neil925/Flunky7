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
    customId: string;
    componentType: ComponentType;
    public async action(interact: Interaction);
}

interface transactionData {
    type: transactionPhase;
    customIndex: number;
    addRoles: string[];
    removeRoles: string[];
}

enum transactionPhase {
    language,
    secondaryLanguage,
    custom,
    rules
}

interface roleTransaction {
    userId: string;
    data: transactionData;
}