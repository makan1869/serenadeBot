const Telegraf = require('telegraf')
const {Extra, Markup} = require('telegraf')

const app = new Telegraf("381900565:AAE-Cf1cNbRCGnCG0-pusV5EzG-XUKXw7rA")
var keywords = ['fohsh', 'فحش']
var session = {}
var users = [99484470]
var channels = []

app.on('callback_query', (ctx) => {
	if(ctx.update.callback_query.data.startsWith("/join")) {
		console.log("Call Back " + ctx.update.callback_query.data)
		var channelName = ctx.update.callback_query.data.replace("/join ", "").trim()
				if(channels[channelName] == null) {
					channels[channelName] = []
				}
				if(!channels[channelName].includes(ctx.chat.id)) {
					channels[channelName].push(ctx.chat.id)
				}
	}
});
app.on('message', (ctx) => {
	if(!users.includes(ctx.chat.id)) {
		users.push(ctx.chat.id)
	}
	console.log(users)
	if(ctx.update.message.reply_to_message) {
		//console.log("Reply  " , ctx.update.message)
		if(session['reply_message_id_' + ctx.update.message.reply_to_message.message_id] ) {
			ctx.reply("در پاسخ به " + session['reply_message_id_' + ctx.update.message.reply_to_message.message_id]  + "متن" +  ctx.update.message.text + " را وارد کرده اید." )
		}
	} else {
		if(ctx.update.message && ctx.update.message.text) {
			if(ctx.update.message.text.startsWith("/post")) {
				console.log("Post  " , ctx.update.message)
				console.log(ctx.update.message.text.replace("/post ", ""));
				ctx.reply('متن پیام خود را وارد کنید', Markup.forceReply().extra()).then((result) => {
					console.log("Result " , result)
					session['reply_message_id_' + result.message_id] = ctx.update.message.text.replace("/post ", "")	
				});
			} else if(ctx.update.message.text.startsWith("/all")) {
				for(i = 0; i< keywords.length; i++) {
					if(ctx.update.message.text.indexOf(keywords[i]) >= 0) {
						return ctx.reply("لغت زشتی وارد کرده اید");

					}
				}
				for(i =0; i<users.length; i++) {
					if(users[i] != ctx.chat.id) {
						app.telegram.sendMessage(users[i], ctx.chat.first_name + " " + ctx.chat.last_name + " : " + ctx.update.message.text.replace("/all ", ""));
					}
					
				}
			} else if(ctx.update.message.text.startsWith("/channel")) {
				for(i = 0; i< keywords.length; i++) {
					if(ctx.update.message.text.indexOf(keywords[i]) >= 0) {
						return ctx.reply("لغت زشتی وارد کرده اید");

					}
				}
				var tokens = ctx.update.message.text.split(/\s+/)
				console.log(tokens)
				if(channels[tokens[1]] == null) {
					channels[tokens[1]] = []
					for(i =0; i<users.length; i++) {
						if(users[i] != ctx.chat.id) {
							app.telegram.sendMessage(users[i], `Channel ${channelName} Created`, Markup.inlineKeyboard([
      							Markup.callbackButton('Join', '/join ' + channelName)
    						]).extra());
						}
					}
				}
				if(!channels[tokens[1]].includes(ctx.chat.id)) {
					channels[tokens[1]].push(ctx.chat.id)
				}
				for(i =0; i<channels[tokens[1]].length; i++) {
					if(channels[tokens[1]][i] != ctx.chat.id) {
						app.telegram.sendMessage(channels[tokens[1]][i], ctx.chat.first_name + " " + ctx.chat.last_name + 
							" [ " + tokens[1] + "] : " + tokens.slice(2).join(" "));
					}
					
				}
			} if(ctx.update.message.text.startsWith("/join")) {
				var channelName = ctx.update.message.text.replace("/join ", "").trim()
				if(channels[channelName] == null) {
					channels[channelName] = []
					for(i =0; i<users.length; i++) {
						if(users[i] != ctx.chat.id) {
							app.telegram.sendMessage(users[i], `Channel ${channelName} Created`, Markup.inlineKeyboard([
      							Markup.callbackButton('Join', '/join ' + channelName)
    						]).extra());
						}
					}
				}
				if(!channels[channelName].includes(ctx.chat.id)) {
					channels[channelName].push(ctx.chat.id)
				}
				

			}
		}
	
	}
	
})

app.startPolling()