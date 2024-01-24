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
}