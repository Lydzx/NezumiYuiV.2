/* eslint-disable no-undef */
const Command = require('../../structures/Command');
const { MersenneTwister19937, integer } = require('random-js');
const { createCanvas, loadImage, registerFont } = require('canvas');
const request = require('node-superfetch');
const path = require('path');
registerFont(path.join(__dirname, '..', '..', 'assets', 'font', 'Pinky Cupid.otf'), { family: 'Pinky Cupid' });


module.exports = class FriendshipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'friendship',
            aliases: ['friendship-meter', 'friends', 'friend', 'friendship-tester', 'friendship-test', 'fs'],
            group: 'fun',
            memberName: 'friendship',
            description: 'Determines how good friends two users are.',
            hidden: false,
            throttling: {
                usages: 1,
                duration: 10,
            },
            clientPermissions: ['ATTACH_FILES'],
            args: [
                {
                    key: 'first',
                    label: 'first user',
                    prompt: 'Who is the first friend?',
                    type: 'user',
                },
                {
                    key: 'second',
                    label: 'second user',
                    prompt: 'Who is the second friend?',
                    type: 'user',
                    default: msg => msg.author,
                },
            ],
        });
    }

    async run(msg, { first, second }) {
        if (first.id === second.id) return msg.reply('You should be good friends with yourself.');
        const calculated = -Math.abs(Number.parseInt(BigInt(first.id) - BigInt(second.id), 10));
        const random = MersenneTwister19937.seed(calculated);
        const level = integer(0, 100)(random);
        const firstAvatarURL = first.displayAvatarURL({ format: 'png', size: 512 });
        const secondAvatarURL = second.displayAvatarURL({ format: 'png', size: 512 });
        try {
            const firstAvatarData = await request.get(firstAvatarURL);
            const firstAvatar = await loadImage(firstAvatarData.body);
            const secondAvatarData = await request.get(secondAvatarURL);
            const secondAvatar = await loadImage(secondAvatarData.body);
            const base = await loadImage('https://cdn.discordapp.com/attachments/688763072864976906/706512440690606181/friendship1.png');
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(firstAvatar, 70, 56, 400, 400);
            ctx.drawImage(secondAvatar, 730, 56, 400, 400);
            ctx.drawImage(base, 0, 0);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#40e9ff';
            ctx.font = '38px Pinky Cupid';
            ctx.fillStyle = 'white';
            ctx.fillText(first.username, 270, 448);
            ctx.fillText(second.username, 930, 448);
            ctx.font = '42px Pinky Cupid';
            ctx.fillStyle = '#1ebefc';
            ctx.fillText(`~${level}%~`, 600, 230);
            ctx.fillText(this.calculateLevelText(level), 600, 296);
            ctx.font = '90px Pinky Cupid';
            ctx.fillText(level > 49 ? '😁' : '😣', 600, 100);
            return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'friendship.png' }] });
        }
        catch (err) {
            return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
        }
    }

    calculateLevelText(level) {
        if (level === 0) return 'Abysmal';
        if (level > 0 && level < 10) return 'Horrid';
        if (level > 9 && level < 20) return 'Awful';
        if (level > 19 && level < 30) return 'Very Bad';
        if (level > 29 && level < 40) return 'Bad';
        if (level > 39 && level < 50) return 'Poor';
        if (level > 49 && level < 60) return 'Average';
        if (level > 59 && level < 70) {
            if (level === 69) return 'Nice';
            return 'Fine';
        }
        if (level > 69 && level < 80) return 'Good';
        if (level > 79 && level < 90) return 'Great';
        if (level > 89 && level < 100) return 'Amazing';
        if (level === 100) return 'Besties';
        return '???';
    }
};
