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
    action: (message: Discord.Message) => { } 
}

interface InteractionInterface {
    interactionType: InteractionType;
    componentTeype: ComponentType;
    public async action(interact: Interaction);
}