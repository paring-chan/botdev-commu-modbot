import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class Reload extends Command {
    constructor() {
        super('리로드', {
            aliases: ['리로드', 'reload', 'rl'],
            ownerOnly: true
        })
    }

    async exec(msg: Message) {
        this.client.listenerHandler.categories.map(r=>r.removeAll())
        this.client.commandHandler.categories.map(r=>r.removeAll())
        this.client.listenerHandler.categories.clear()
        this.client.commandHandler.categories.clear()
        Object.keys(require.cache).filter(r=>!r.includes('node_modules')).forEach(r=>delete require.cache[r])
        this.client.listenerHandler.loadAll()
        this.client.commandHandler.loadAll()
        await msg.util?.send('리로드 끝남')
    }
}