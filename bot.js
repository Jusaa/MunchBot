const Discord = require("discord.js");
const auth = require("./auth.json");

const client = new Discord.Client();

var reaction_numbers = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"];


client.on("ready", () => {
	console.log("I am ready!");
});

client.on("message", (message) => {

	if(message.author.bot) return;

	const args = message.content.slice(1).trim().split(" ");
	const command = args.shift().toLowerCase();
	if(command === "r"){
		const boss = args[0];
		const time = args[1];
		let gym = "";
		let i;
		for(i = 2; i < args.length; i++){
			gym = gym + args[i] + " ";
		}
		const msg = "```Boss: " + boss + "\nTime: " + time + "\nLocation: " + gym + "```"; 
		
		message.delete().catch(O_o=>{});
		message.channel.send(msg)
			.then(async function (message) {
				message.react(reaction_numbers[1]);
				message.react(reaction_numbers[2]);
				message.react(reaction_numbers[3]);
				message.react(reaction_numbers[4]);
				message.react(reaction_numbers[5]);
				message.react(reaction_numbers[6]);
			}).catch(function() {
				console.log("ERROR WHEN REACTING TO MESSAGE");
			});
	}

	if (command === "ping") {
		message.channel.send("pong!");
	}
});

client.login(auth.token);
