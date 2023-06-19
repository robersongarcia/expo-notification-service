const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const { Expo } = require('expo-server-sdk');
const { getPatientInfo, getPatientsTokens } = require('./helpers/patients');
const { getDoctorsTokens } = require('./helpers/doctors');

let expo = new Expo();

async function sendNotifications(tokens, data, title, message) {
	let messages = [];

	for (let pushToken of tokens) {
		//Check that all your push tokens appear to be valid Expo push tokens
		if (!Expo.isExpoPushToken(pushToken)) {
			console.error(
				`Push token ${pushToken} is not a valid Expo push token`
			);
			continue;
		}

		messages.push({
			to: pushToken,
			sound: 'default',
			title: title,
			body: message,
			data: { data },
		});
	}

	let chunks = expo.chunkPushNotifications(messages);
	let tickets = [];

	for (let chunk of chunks) {
		try {
			let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
			console.log(ticketChunk);
			tickets.push(...ticketChunk);
		} catch (error) {
			console.error(error);
		}
	}
}

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
	console.log(`App listening on port ${PORT}`);
	console.log('Press Ctrl+C to quit.');
});

app.get('/', (req, res) => {
	res.send('Server Up!');
});

app.post('/send-notifications', async (req, res) => {
	const { uid, alert, summary } = req.body;

	console.log({ uid });

	if (uid === undefined) {
		return res.status(400).send('Invalid Request: no uid');
	}

	if (alert === undefined) {
		return res.status(400).send('Invalid Request: no alert');
	}

	if (summary === undefined) {
		return res.status(400).send('Invalid Request: no summary');
	}

	const resp = await getPatientInfo(uid);

	if (!resp) {
		return res.status(400).send('Invalid Request: Patient not found');
	}

	console.log({ resp });

	const { medicId } = resp;

	const tokens = await getDoctorsTokens(medicId);

	console.log({ tokens });

	if (tokens.length === 0) {
		return res.status(200).send('No tokens found');
	}

	if (alert) {
		const fullName = `${resp.firstName} ${resp.lastName}`;
		const title = `ALERTA: Paciente ${fullName}`;
		const message = `Resumen de questionario: ${summary}`;
		await sendNotifications(tokens, uid, title, message);
	}

	res.status(200).send('Notifications sent');
});

async function sendNotificationsForPatients(data, message) {
	const tokens = await getPatientsTokens();
	await sendNotifications(tokens, data, message);
}

// calculate the number of milliseconds until the next Monday at midnight
const now = new Date();
const nextMonday = new Date(
	now.getFullYear(),
	now.getMonth(),
	now.getDate() + ((8 - now.getDay()) % 7),
	0,
	0,
	0
);
const timeUntilNextMonday = nextMonday.getTime() - now.getTime();

// run the task once a week (every 604800000 milliseconds)
setInterval(
	() => sendNotificationsForPatients('data', 'Test Patient notification'),
	604800000,
	timeUntilNextMonday
);

app.get('/send-notifications-for-patients-test', async (req, res) => {
	await sendNotificationsForPatients('data', 'Test Patient notification');
	res.status(200).send('Notifications sent');
});
