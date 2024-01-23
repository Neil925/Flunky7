interface LangaugeConfig {
    languagePrompt: string;
    interactions: BotInteraction[];
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