const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = function () {
	this.updates_part_1 = function(existing_setup) {
		const setup = (existing_setup.length > 0) ? `\n:warning: Your server has already set up receiving _${ existing_setup.join(", ") }_.\n***The previous configuration will be deleted after running this command.***\n\n` : "";
		const part1 = new EmbedBuilder()  
	        .setTitle(`Software Updates - Updates Setup Part 1`)
	        .setColor("#00d768")
			.setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
	        .setDescription(`\n**Please select the channel that you want me to send new Apple updates to.**\n${setup}*If you don't select within 1 minute, the command will time out.*`);
	    return part1;
	}

	this.updates_part_2 = function(selected_channel) {
	    const part2 = new EmbedBuilder()
	        .setTitle(`Software Updates - Updates Setup Part 2`)
			.setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
	        .setDescription(`\n**Select the updates you want to receive notifications for in <#${selected_channel.id}>.**\n*You can select multiple options from the dropdown menu below.*\n*If you don't select within 1 minute, the command will time out.*`)
	        .setColor("#00d768");
	    return part2;
	}

	this.updates_overall = function(selected_channel, selected_options) {
		const overall = new EmbedBuilder()
		    .setTitle(`Software Updates - Setup Overview`)
		    .setDescription(`**Your setup data has been saved successfully!**`)
		    .addFields(
				{ name: `Selected channel`, value: selected_channel, inline: true },
				{ name: `Selected updates`, value: selected_options + ".", inline: true }
			)
		    .setColor("#1c95e0")
		    .setTimestamp();
		return overall;
	}


	this.roles_part_1 = function () {
		const embed = new EmbedBuilder()   
		    .setTitle(`Software Updates - Notification Roles Setup Part 1`)
		    .setColor("#00d768")
			.setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
		    .setDescription(`\n**Please select an update name that you would like to get ping notifications for.**\n*If you don't select within 1 minute, the command will time out.*`);
		return embed;
	}

	this.roles_part_2 = function (os) {
	    const embed = new EmbedBuilder()      
	        .setTitle(`Software Updates - Notification Roles Setup Part 2`)
	        .setColor("#00d768")
			.setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
	        .setDescription(`\n**Please select the role that you would like me to ping when a new ${os} is available.**\n*If you don't select within 1 minute, the command will time out.*`);
	    return embed;
	}

	this.roles_overall = function (selected_role, selected_update, option) {
		const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                    .setURL("https://discord.gg/ktHmcbpMNU")
                    .setLabel('Join support server')
                    .setStyle(ButtonStyle.Link));
	    const choice = (option) ? "will ping" : "will no longer ping";
	    const overall = new EmbedBuilder()       
	        .setTitle(`Software Updates - Setup Overview`)
	        .setColor("#1c95e0")
			.setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
	        .setDescription(`**Your setup data has been saved successfully!**\nFrom now on, I ${choice} ${selected_role} when a new ${selected_update} is available!`)
	        .setTimestamp();
	    return { embeds: [overall], components: [button] };
	}

	this.roles_remove = function (roles) {
	    const embed = new EmbedBuilder()    
	        .setTitle(`Software Updates - Notification Roles Removal`)
	        .setColor("#00d768")
			.setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
	        .setDescription(`\n**Please select an update name that you would like to remove ping notifications for.**\nYour server has these notification roles configured: 
	        - ${roles.join(`\n - `)}\n*If you don't select within 1 minute, the command will time out.*`);
	    return embed;
	}

	this.roles_list = function (roles) {
	    const embed = new EmbedBuilder()      
	        .setTitle(`Software Updates - Configured Notification Roles`)
	        .setColor("#00d768")
			.setThumbnail(global.bot.user.displayAvatarURL({ format: "png", dynamic: true }))
	        .setDescription(`\n**Your server has these notification roles configured:**
	        - ${roles.join(`\n - `)}`);
	    return { embeds: [embed] };
	}

	this.error_embed = function(content) {
		const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                    .setURL("https://discord.gg/ktHmcbpMNU")
                    .setLabel('Join support server')
                    .setStyle(ButtonStyle.Link));
	    const error = new EmbedBuilder()
	        .setTitle("An issue has occured!")
	        .setColor("#c2002a")
	        .setDescription(`${content} \n\n *Please try again later.\nIf you need help, join our support server: https://discord.gg/ktHmcbpMNU*`);
	    return { embeds: [error], components: [button] };
	}
}