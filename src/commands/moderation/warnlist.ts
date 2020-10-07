import { Command } from "discord-akairo";
import { Message } from "discord.js";
import page from "../../util/page";

export default class Reload extends Command {
    constructor() {
        super('경고목록', {
            aliases: ['경고목록'],
        })
    }

    async exec(msg: Message) {
        if (!await page(msg, async () => (await this.client.db('warns')).filter(r=> this.client.users.cache.get(r.user)).map(r=>`ID: ${r.id} 멤버: ${this.client.users.cache.get(r.user)!.tag} 사유: ${r.reason}`), 5,msg.embed().setTitle('경고 목록'))) 
            return msg.util?.send('경고 없음')
    }
}