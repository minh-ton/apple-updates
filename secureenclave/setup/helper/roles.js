const Discord = require('discord.js');
const firebase = require("firebase-admin");

const db = firebase.firestore();

require("./misc/embeds.js")();

const os_updates = {
    ios: "iOS Updates",
    ipados: "iPadOS Updates",
    watchos: "watchOS Updates",
    macos: "macOS Updates",
    tvos: "tvOS Updates",
    audioos: "audioOS Updates",
    bot: `<@852378577063116820>'s announcements`,
    pkg: "macOS InstallAssistant.pkg Links",
}

const database = db.collection('discord').doc('roles').collection('servers');

module.exports = function () {
	this.setup_roles = async function (message, args) {
		if (args[1] == "add") {
			message.channel.send(roles_part_1());

		} else if (args[1] == "remove") {
			let roles = await database.doc(message.guild.id).get();
			let data = roles.data();
			let arr = [];
			for (let os in data) arr.push(`\`${os}\` : <@&${data[os]}> (${os_updates[os]})`);
        	if (arr.length < 1) return message.channel.send(error_embed(`Your server has no notification roles configured!`));
        	message.channel.send(roles_remove(arr));

		} else if (args[1] == "list") {
			let roles = await database.doc(message.guild.id).get();
			let data = roles.data();
			let arr = [];
			for (let os in data) arr.push(`\`${os}\` : <@&${data[os]}> (${os_updates[os]})`);
        	if (arr.length < 1) return message.channel.send(error_embed(`Your server has no notification roles configured!`));
        	return message.channel.send(roles_list(arr));

		} else {
			 return message.channel.send(error_embed(`Invalid option or no option provided.\n
	        - To list configured notification roles, type \`apple!setup role list\`
	        - To set up a notification role, type \`apple!setup role add\`
	        - To remove a notification role, type \`apple!setup role remove\``));
		}

		const ms_filter = m => m.author.id == message.author.id;
    	const selected_os = await message.channel.awaitMessages({ ms_filter, max: 2, time: 180000 });

    	if (selected_os.size < 2 || !selected_os.size) return message.channel.send(error_embed("You did not reply within 3 minutes so the command was cancelled."));

    	let choice = Array.from(selected_os)[1][1].content.toLowerCase();

    	var selected_role = undefined;

    	if (args[1] == "add") {
	        switch (choice) {
	            case "tvos":
	                message.channel.send(roles_part_2("tvOS Update"));
	                break;
	            case "audioos":
	                message.channel.send(roles_part_2("audioOS Update"));
	                break;
	            case "macos":
	                message.channel.send(roles_part_2("macOS Update"));
	                break;
	            case "ios":
	                message.channel.send(roles_part_2("iOS Update"));
	                break;
	            case "ipados":
	                message.channel.send(roles_part_2("iPadOS Update"));
	                break;
	            case "watchos":
	                message.channel.send(roles_part_2("watchOS Update"));
	                break;
	            case "pkg":
	                message.channel.send(roles_part_2("macOS InstallAssistant.pkg Link"));
	                break;
	            case "delta":
	                message.channel.send(roles_part_2("macOS Delta Updates Link"));
	                break;
	            case "bot":
	                message.channel.send(roles_part_2(`<@${global.bot.user.id}>'s announcements`));
	                break;
	            default:
	                return message.channel.send(error_embed("Invalid OS name."));
	        }

	        const reply = await message.channel.awaitMessages({ms_filter, max: 2, time: 180000 });

	        if (!reply.size) return message.channel.send(error_embed("You did not reply within 3 minutes so the command was cancelled."));
	        if (!Array.from(reply)[1][1].content.match(/^<@&!?(\d+)>$/)) return message.channel.send(error_embed("I may not have the necessary permissions to fetch the role or I was unable to read your message."));

	        selected_role = message.guild.roles.cache.get(Array.from(reply)[1][1].content.match(/^<@&!?(\d+)>$/)[1]);
	        if (selected_role == undefined) return message.channel.send(error_embed("I may not have the necessary permissions to fetch the role or the chosen role does not exist."));

	        let roles_database = await database.doc(message.guild.id).get();
	        let roles_data = roles_database.data();

	        (roles_data == undefined) ? await database.doc(message.guild.id).set({
	            [`${choice}`]: `${selected_role.id}`
	        }) : await database.doc(message.guild.id).update({
	            [`${choice}`]: `${selected_role.id}`
	        });

	    } else {

	        if (os_updates[choice] == undefined) return message.channel.send(error_embed("Invalid OS name."));

	        let doc = await database.doc(message.guild.id).get();
	        let data = doc.data();
	        let role_id = data[choice];

	        if (role_id == undefined) return message.channel.send(error_embed(`Your server didn't set up ping notification for ${os_updates[choice]}!`));

	        selected_role = message.guild.roles.cache.get(role_id);

	        await database.doc(message.guild.id).update({
	            [`${choice}`]: firebase.firestore.FieldValue.delete()
	        });
	    }

	    switch (choice) {
	        case "tvos":
	            message.channel.send(roles_overall(`<@&${(selected_role) ? selected_role.id : "0100"}>`, "tvOS Update", args[1] == "add"));
	            break;
	        case "audioos":
	            message.channel.send(roles_overall(`<@&${(selected_role) ? selected_role.id : "0100"}>`, "audioOS Update", args[1] == "add"));
	            break;
	        case "macos":
	            message.channel.send(roles_overall(`<@&${(selected_role) ? selected_role.id : "0100"}>`, "macOS Update", args[1] == "add"));
	            break;
	        case "ios":
	            message.channel.send(roles_overall(`<@&${(selected_role) ? selected_role.id : "0100"}>`, "iOS Update", args[1] == "add"));
	            break;
	        case "ipados":
	            message.channel.send(roles_overall(`<@&${(selected_role) ? selected_role.id : "0100"}>`, "iPadOS Update", args[1] == "add"));
	            break;
	        case "watchos":
	            message.channel.send(roles_overall(`<@&${(selected_role) ? selected_role.id : "0100"}>`, "watchOS Update", args[1] == "add"));
	            break;
	        case "pkg":
	            message.channel.send(roles_overall(`<@&${(selected_role) ? selected_role.id : "0100"}>`, "macOS InstallAssistant.pkg Link", args[1] == "add"));
	            break;
	        case "delta":
	            message.channel.send(roles_overall(`<@&${(selected_role) ? selected_role.id : "0100"}>`, "macOS Delta Update Link", args[1] == "add"));
	            break;
	        case "bot":
	            message.channel.send(roles_overall(`<@&${(selected_role) ? selected_role.id : "0100"}>`, `<@${global.bot.user.id}>'s announcements`, args[1] == "add"));
	            break;
	        default:
	            return;
	    }
	}
}