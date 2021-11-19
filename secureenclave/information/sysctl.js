// Show host machine info 

const Discord = require('discord.js');
const sysctl = require('systeminformation');

require('../../applesilicon/misc.js')();

module.exports = {
    name: 'sysctl',
    command: 'sysctl',
    category: 'Information',
    usage: '`apple!sysctl`',
    cooldown: 5,
    description: 'Shows the host machine info.',
    async execute(message, args) {
        const memory_data = await sysctl.mem();
        const cpu_data = await sysctl.cpu();
        const os_data = await sysctl.osInfo();

        const sysctl_embed = new Discord.MessageEmbed()
            .setTitle("Host Machine Information")
            .setColor(randomColor())
            
            // Memory
            .addField("<:ram:907994041549979688> Memory", `‣ **Total**: ${formatBytes(memory_data.total)}\n‣ **Free**: ${formatBytes(memory_data.free)}\n‣ **Used**: ${formatBytes(memory_data.used)}\n‣ **Active**: ${formatBytes(memory_data.active)}\n‣ **Available**: ${formatBytes(memory_data.available)}\n‣ **Swap**: ${formatBytes(memory_data.swapused)}`, true)

            // Operating System
            .addField("<:os:907994041524838490> OS", `‣ **Platform**: ${os_data.platform[0].toUpperCase() + os_data.platform.substring(1)}\n‣ **Distro**: ${os_data.distro}\n‣ **Release**: ${os_data.release}\n‣ **Kernel**: ${os_data.kernel}\n‣ **Arch**: ${os_data.arch}`, true)

            // Processor
            .addField("<:cpu:907994041436733460> Processor", `‣ **Manufacturer**: ${cpu_data.manufacturer}\n‣ **Brand**: ${cpu_data.brand}\n‣ **Speed**: ${cpu_data.speed + 'GHz'}\n‣ **Cores**: ${cpu_data.cores}`, true)

            .setFooter(`This is where I live!`)
            .setTimestamp();
        message.channel.send({ embeds: [sysctl_embed] });
    },
};