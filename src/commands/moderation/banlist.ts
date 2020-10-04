import { Command } from "discord-akairo";
import { Message } from "discord.js";
import page from '../../util/page'

export default class Reload extends Command {
    constructor() {
        super('차단목록', {
            aliases: ['차단목록'],
            args: []
        })
    }

    async exec(msg: Message) {
        if (!await page(msg, async () => (await msg.guild!.fetchBans()).map(r=>`${r.user.tag} - ${r.reason || '사유 없음'}`), 5, msg.embed().setTitle('차단 목록'))) {
            return msg.util?.send('차단 당한 멤버가 없습니다')
        }
    }
}