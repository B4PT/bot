'use strict'
// je suis un forceur à la maison
const express = require('express')
	const bodyParser = require('body-parser')
	const app = express()
	const request = require('request')
	const token = process.env.mytoken
	app.set('port', (process.env.PORT || 5000))

	// Process application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({
			extended: false
		}))

	// Process application/json
	app.use(bodyParser.json())

	// Index route
	app.get('/', function (req, res) {
		res.send('Hello world, je suis un chat bot ! :)')
	})

	// for Facebook verification
	app.get('/webhook/', function (req, res) {
		if (req.query['hub.verify_token'] === 'myToken') {
			res.send(req.query['hub.challenge'])
		}
		res.send('Error, wrong token')
	})

	app.post('/webhook', (req, res) => {

		// Parse the request body from the POST
		let body = req.body;

		// Check the webhook event is from a Page subscription
		if (body.object === 'page') {

			// Iterate over each entry - there may be multiple if batched
			body.entry.forEach(function (entry) {

				// Gets the body of the webhook event
				let webhook_event = entry.messaging[0];
				console.log('RECEIVED :' + webhook_event.message);

				// Get the sender PSID
				let sender_psid = webhook_event.sender.id;
				console.log('Sender PSID: ' + sender_psid);

				// Check if the event is a message or postback and
				// pass the event to the appropriate handler function
				if (webhook_event.message) {
					if (webhook_event.message.quick_reply) {
						handleQuickReply(sender_psid, webhook_event.message.quick_reply);
					} else {
						handleMessage(sender_psid, webhook_event.message);
					}
				}
				if (webhook_event.postback) {
					handlePostback(sender_psid, webhook_event.postback);
				}

			});

			// Return a '200 OK' response to all events
			res.status(200).send('EVENT_RECEIVED');

		} else {
			// Return a '404 Not Found' if event is not from a page subscription
			res.sendStatus(404);
		}

	});

//-----------------------------------------------------------------------------------------------------------
//----------------------------------------Handles quick replies----------------------------------------------
//-----------------------------------------------------------------------------------------------------------
function handleQuickReply(sender_psid, received_message) {
	let response;

	if (received_message.payload === 'new.forme') {
		response = {
			"text": "Genial, je te souhaite une bonne journée alors !\u000AFais pas trop d'écran, ça abîme les yeux... 👓"
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'new.fatigue') {
		response = {
			"text": "Va te reposer alors beauté !"
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'new.ennui') {
		response = {
			"text": "Je te propose d'aller faire un tour dehors ☀️ !"
		}
		callSendAPI(sender_psid, response);
	}

}

//----------------------------------------------------------------------------------------------------------
// ---------------------------------------------Handles messages--------------------------------------------
//----------------------------------------------------------------------------------------------------------


function handleMessage(sender_psid, received_message) {
	let response;
	
	if (received_message.text == "Démarrer") {
		let response = {
			"text": "Bonjour !\u000AJe suis LE chat bot de l'internet 😈 \u000A\u000A\u23E9 Avant de commencer, peux tu me dire qui tu es ? 🤔",
			"quick_replies": [{
					"content_type": "text",
					"title": "👶",
					"payload": "get_started.bebe"
				}, {
					"content_type": "text",
					"title": "👩",
					"payload": "get_started.femme"
				}, {
					"content_type": "text",
					"title": "👨",
					"payload": "get_started.homme"
				}, {
					"content_type": "text",
					"title": "🤖",
					"payload": "get_started.robot"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}
}

//----------------------------------------------------------------------------------------------------------
// ------------------------------------Handles messaging_postbacks events-----------------------------------
//----------------------------------------------------------------------------------------------------------
function handlePostback(sender_psid, received_postback) {
	let response;

	// Get the payload for the postback
	// c'est 20 caractères max dans le title des text BAPT
	let payload = received_postback.payload;

	if (payload === 'new') {
		let response = {
			"text": "Bonjour l'ami 😀\u000AQuoi de beau aujourd'hui?",
			"quick_replies": [{
					"content_type": "text",
					"title": "La forme 😎",
					"payload": "new.forme"
				}, {
					"content_type": "text",
					"title": "Fatigué .. 😴",
					"payload": "new.fatigue"
				}, {
					"content_type": "text",
					"title": "Je m'ennuie 😐",
					"payload": "new.ennui"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (payload === 'contact') {
		let response = {
			"text": " On s'appele ? 📞",
			"quick_replies": [{
					"content_type": "text",
					"title": "OK.",
					"payload": "contact.ok"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (payload === 'GET_STARTED') {
		let response = {
			"text": "Bonjour !\u000AJe suis LE chat bot de l'internet 😈 \u000A\u000A\u23E9 Avant de commencer, peux tu me dire qui tu es ? 🤔",
			"quick_replies": [{
					"content_type": "text",
					"title": "👶",
					"payload": "get_started.bebe"
				}, {
					"content_type": "text",
					"title": "👩",
					"payload": "get_started.femme"
				}, {
					"content_type": "text",
					"title": "👨",
					"payload": "get_started.homme"
				}, {
					"content_type": "text",
					"title": "🤖",
					"payload": "get_started.robot"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (payload === 'get_started.bebe') {
		let response = {
			"text": "Coucou baby 👶\u000AOn joue à un jeu ? 🤪",
			"quick_replies": [{
					"content_type": "text",
					"title": "Chaud 👍",
					"payload": "bebe.chaud"
				}, {
					"content_type": "text",
					"title": "Pas chaud 🧐",
					"payload": "bebe.paschaud"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (payload === 'get_started.femme') {
		let response = {
			"text": "Salut toi 👩\u000A Parlons sport un peu 🏃‍♀️",
			"quick_replies": [{
					"content_type": "text",
					"title": "Chaud 👍",
					"payload": "femme.chaud"
				}, {
					"content_type": "text",
					"title": "Non merci 💁‍♀️",
					"payload": "femme.paschaud"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (payload === 'get_started.homme') {
		let response = {
			"text": "Yo mec 👨\u000A Et si on écrivait un rap ensemble ? 🎤",
			"quick_replies": [{
					"content_type": "text",
					"title": "Chaud 👍",
					"payload": "homme.chaud"
				}, {
					"content_type": "text",
					"title": "C'est mort 😑",
					"payload": "homme.paschaud"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (payload === 'homme.chaud') {
		let response = {
			"text": "Let's go\u000A On est pas tout seul,",
			"quick_replies": [{
					"content_type": "text",
					"title": "Le crew est la 👊",
					"payload": "chaud.crew"
				}, {
					"content_type": "text",
					"title": "Mamie est la 👵🏻",
					"payload": "chaud.mamie"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}
}

function callSendAPI(sender_psid, response) {
	// Construct the message body
	let request_body = {
		"messaging_type": "RESPONSE",
		"recipient": {
			"id": sender_psid
		},
		"message": response
	}

	// Send the HTTP request to the Messenger Platform
	request({
		"uri": "https://graph.facebook.com/v2.6/me/messages",
		"qs": {
			"access_token": token
		},
		"method": "POST",
		"json": request_body
	}, (err, res, body) => {
		if (!err) {
			console.log('message sent!')
		} else {
			console.error("Unable to send message:" + err);
		}
	});
}

// Spin up the server
app.listen(app.get('port'), function () {
	//console.log('running on port', app.get('port'))
})
