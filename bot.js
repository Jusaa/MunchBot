const Discord = require("discord.js");
const auth = require("./auth.json");
const dateDifference = require("date-difference");

const client = new Discord.Client();
// Reaction numbers as Unicode, reacting with them normally doesn't work
var reaction_numbers = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"];
const startTime = new Date();

client.on("ready", () => {
	console.log("I am ready!");
	client.user.setUsername("MunchBot");
});

// Triggered when message is sent in server
client.on("message", (message) => {

	// Prevent loop from bots own messages
        if(message.author.bot) return;

	// Get command and its arguments
	if(message.content.substring(0, 1) == "!"){
	        const args = message.content.slice(1).trim().split(" ");
        	const command = args.shift().toLowerCase();

		// Creating a raid
		if(command === "r"){
	                const boss = args[0];
       	        	const time = args[1];
                	let gym = "";
                	let i;
                	for(i = 2; i < args.length; i++){
                	        gym = gym + args[i] + " ";
                	}
                	const msg = "```Boss: " + boss + "\nTime: " + time + "\nLocation: " + gym + "\n-------------------------\nIlmoittautuneet: \nYhteensä: 0```";
                	message.delete().catch(O_o=>{});
                	message.channel.send(msg)
				.then(function(message){
	        	                message.react("438598806825861131" /*reaction_numbers[1]*/);
	        	                message.react("438599265283997706" /*reaction_numbers[2]*/);
	        	                message.react("438599716863868928" /*reaction_numbers[3]*/);
				});
		}

		// PingPong!
        	if (command === "ping") {
        	        message.channel.send("pong!`" + (new Date().getTime() - message.createdTimestamp) + "ms`");
        	}

		// General info!
        	if (command === "info") {
        		message.channel.send("Munchbot uptime " + dateDifference(startTime, new Date()));
        	}
	}
});

function editMessage(reaction, user) {

	if(user.bot) return;
        if(reaction.message.author.id !== client.user.id) return;

        let newMessageContent = "";
        let msgParts = reaction.message.content.split("Ilmoittautuneet:");

        // -6, so we don't count bot's own reactions!
        let playerCount = -6;
        let users = new Map();

        for (var [key, value] of reaction.message.reactions) {
		console.log(key);
                if(key === "3_:438599716863868928" /*reaction_numbers[3]*/){
                        for(var [ukey, uvalue] of value.users){
                               	if(!users.has(uvalue.username)){
                                        users.set(uvalue.username, 2);
                                }else{
                                      	users.set(uvalue.username, users.get(uvalue.username) + 3);
                                }
                         }
                        playerCount += value.count * 3;
                } else if(key === "2_:438599265283997706" /*reaction_numbers[2]*/){
                        for(var [ukey, uvalue] of value.users){
                                if(!users.has(uvalue.username)){
                                        users.set(uvalue.username, 1);
                                }else{
                                      	users.set(uvalue.username, users.get(uvalue.username) + 2);
                                }
                         }
                        playerCount += value.count * 2;
                } else if(key === "1_:438598806825861131" /*reaction_numbers[1]*/){
                        for(var [ukey, uvalue] of value.users){
                                if(!users.has(uvalue.username)){
                                        users.set(uvalue.username, 0);
                                }else{
                                      	users.set(uvalue.username, users.get(uvalue.username) + 1);
                                }
                         }
                        playerCount += value.count;
                }
        }

        let usernamelist = "";
        for (var [key, value] of users) {
                if(key !== "MunchBot") {
                        if(value != 0){
                                usernamelist += "(" + (value + 1) + ") " + key + " +" + value + "\n";
                        }else{
                              	usernamelist += "(" + (value + 1) + ") " + key + "\n";
                        }
                }
        }
	newMessageContent = msgParts[0] + "Ilmoittautuneet:\n" + usernamelist + "\nYhteensä: " + playerCount + "```";

        reaction.message.edit(newMessageContent);

}

client.on("messageReactionAdd", (reaction, user) => {
	editMessage(reaction, user);
});

client.on("messageReactionRemove", (reaction, user) => {
	editMessage(reaction, user);
});

client.login(auth.token);
