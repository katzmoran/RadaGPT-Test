/** Name of the AI (also used as application name). */
export const AI_NAME: string = "Azure Chat";
/** Description of the AI (also used for application description). */
export const AI_DESCRIPTION: string = "Azure Chat is a friendly AI assistant.";

/** Link to internal AI Policy (optional). */
export const AI_POLICY: string | null = "https://example.com"
/** Name of host organization. */
export const ORGANIZATION_NAME: string = "Contoso"

/** Disclaimer for chat interactions (optional). */
export const CHAT_DISCLAIMER: string | null = `${AI_NAME} can make mistakes, always check important info. Interactions are logged.`

/** Show AI name and icon above chat responses. */
export const SHOW_AI_NAME_ON_RESPONSE: boolean = true;
/** Show user name and image above chat prompts. */
export const SHOW_USER_NAME_ON_PROMPT: boolean = false;

/** Use image alt text as caption if no caption is present. */
export const USE_ALT_AS_CAPTION: boolean = true;
/** Display line numbers for codeblocks. */
export const SHOW_CODEBLOCK_LINE_NUMBERS: boolean = false;
/** Show copy button on codeblocks. */
export const SHOW_CODEBLOCK_COPY_BUTTON: boolean = true;
/** Show "thumbs up/down" voting buttons under chat completions. */
export const SHOW_COMPLETION_VOTING: boolean = true;

/** Name of the Azure Cosmos DB app database. */
export const DB_NAME: string = "chat";
/** Name of the Azure Cosmos DB container storing app configurations. */
export const CONFIG_CONTAINER_NAME: string = "config";
/** Name of the Azure Cosmos DB container storing chat details. */
export const CHAT_CONTAINER_NAME: string = "chats";

