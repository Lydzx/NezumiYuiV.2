const SubredditCommand = require('../../structures/commands/Subreddit');
const { MessageEmbed } = require('discord.js');
const { list, formatNumber } = require('../../util/Util');
const subreddits = require('../../assets/json/meme');

module.exports = class MemeCommand extends SubredditCommand {
    constructor(client) {
        super(client, {
            name: 'meme',
            group: 'fun',
            memberName: 'meme',
            description: 'Responds with a random meme.',
            details: `**Subreddits:** ${subreddits.join(', ')}`,
            clientPermissions: ['ATTACH_FILES'],
            postType: 'image',
            hidden: false,
            getIcon: true,
            args: [
                {
                    key: 'subreddit',
                    prompt: `What subreddit do you want to get memes from? Either ${list(subreddits, 'or')}.`,
                    type: 'string',
                    oneOf: subreddits,
                    default: () => subreddits[Math.floor(Math.random() * subreddits.length)],
                    parse: subreddit => subreddit.toLowerCase(),
                },
            ],
        });
    }

    generateText(post, subreddit, icon) {
        return new MessageEmbed()
            .setColor('#cce7e8')
            .setAuthor(`r/${subreddit}`, icon, `https://www.reddit.com/r/${subreddit}/`)
            .setTitle(post.title)
            .setImage(post.post_hint === 'image' ? post.url : null)
            .setURL(`https://www.reddit.com${post.permalink}`)
            .setTimestamp(post.created_utc * 1000)
            .setFooter(`⬆ ${formatNumber(post.ups)}`);
    }
};
