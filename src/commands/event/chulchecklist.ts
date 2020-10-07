import { Command } from "discord-akairo";
import { Message } from "discord.js";
import page from "../../util/page";

export default class Reload extends Command {
    constructor() {
        super('출석목록', {
            aliases: ['출석목록']
        })
    }

    async exec(msg: Message) {
        if (!(await this.client.db('chulchecks')).length) return msg.util?.send('출석 한사람이 없어요')

        const list = await this.client.db('chulchecks').distinct('user')

        await page(msg, async () => {
            const out : string[] = []
            for (let item of list) {
                const data = await this.client.db('chulchecks').where({user:item.user})
                out.push(`<@${item.user}> - ${data.length}번`)
            }
            return out
        }, 5, msg.embed().setTitle('출석 목록'))
    }
}