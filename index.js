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

	if (received_message.payload === 'éclaireur') {
		response = {
			"text": "Enchanté ! Je suis ravi de parler avec toi, comment puis-je t’aider ? 🤖",
			"quick_replies": [{
					"content_type": "text",
					"title": "Woodcraft 📝",
					"payload": "woodcraft"
				}, {
					"content_type": "text",
					"title": "Envoie des 📸",
					"payload": "photo scout"
				}, {
					"content_type": "text",
					"title": "Écris moi 📩",
					"payload": "ecris"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'CEP') {
		response = {
			"text": "Maîtrise formée, Maîtrise au taquet ! 💪"
		}
		callSendAPI(sender_psid, response);

		response = {
			"attachment": {
				"type": "image",
				"payload": {
					"url": "https://sufbot.github.io/mybot/image2.png",
					"is_reusable": true
				}
			},
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
	}

	if (received_message.payload === 'feu') {
		response = {
			"text": "Allumez le feu ! Allumez le feu ! 🎤",
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
		response = {
			"attachment": {
				"type": "file",
				"payload": {
					"url": "https://sufbot.github.io/mybot/Feu_Fiche_pratique.pdf",
					"is_reusable": true
				}
			},
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

}

//----------------------------------------------------------------------------------------------------------
// ---------------------------------------------Handles messages--------------------------------------------
//----------------------------------------------------------------------------------------------------------


function handleMessage(sender_psid, received_message) {
	if (received_message.text == "Un chef éclaireur") {
		let response = {
			"text": "Canon ! Merci de ton engagement pour ta troupe, comment puis-je aider ? 🤖",
			"quick_replies": [{
					"content_type": "text",
					"title": "Mon camp scout 🏕",
					"payload": "camp"
				}, {
					"content_type": "text",
					"title": "CEP - Encadrement ⁉️",
					"payload": "CEP"
				}, {
					"content_type": "text",
					"title": "Envoie de 📸",
					"payload": "photo chef"
				}, {
					"content_type": "text",
					"title": "Nous 📞?",
					"payload": "contact"
				}, {
					"content_type": "text",
					"title": "Écris moi 📩",
					"payload": "ecris"
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
	let payload = received_postback.payload;

	if (payload === 'new') {
		response = {
			"text": "Bonjour l'ami 😀\u000AQuoi de beau aujourd'hui?",
			"quick_replies": [{
					"content_type": "text",
					"title": "La forme franchement 😎",
					"payload": "forme"
				}, {
					"content_type": "text",
					"title": "Je suis fatigué mon petit 😴",
					"payload": "fatigue"
				}, {
					"content_type": "text",
					"title": "Je m'ennuie en fait 😐",
					"payload": "ennui"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (payload === 'contact') {
		response = {
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
					"payload": "bebe"
				}, {
					"content_type": "text",
					"title": "👩",
					"payload": "femme"
				}, {
					"content_type": "text",
					"title": "👨",
					"payload": "homme"
				}, {
					"content_type": "text",
					"title": "🤖",
					"payload": "robot"
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
