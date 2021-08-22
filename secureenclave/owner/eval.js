// Run arbitrary JS code

require('../../applesilicon/embed.js')();

const clean = text => {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }

module.exports = {
    name: 'eval',
    command: 'eval <code>',
    category: 'Owner',
    usage: '`apple!eval <code>`',
    description: '**[Owner Only]** Evaluates JavaScript code.',
    async execute(message, args) {
        let isBotOwner = message.author.id == '589324103463338007';
        if (!isBotOwner) return message.channel.send(minor_error_embed('Want to take control of me? NO!'));

        try {
            const code = args.join(" ");
            
            if (!code) return message.channel.send(minor_error_embed('How could I execute your code if you didn\'t provide any?'));

            let evaled = eval(code);

            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

            message.channel.send(`\`\`\`xl\n${clean(evaled)}\n\`\`\``, { split: true });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }

    },
};
