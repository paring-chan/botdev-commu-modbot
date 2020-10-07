import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class Reload extends Command {
    constructor() {
        super('규칙', {
            aliases: ['규칙']
        })
    }

    async exec(msg: Message) {
        await msg.util?.send(msg.embed().setTitle('규칙').setDescription('이 서버에 규칙같은건 없다(?)'))
    }
}