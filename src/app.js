const express = require("express")
const cors = require("cors")
const logger = require("morgan")
const { Expo } = require('expo-server-sdk')
const { getPatientInfo } = require("./helpers/patients")
const { getDoctorsTokens } = require("./helpers/doctors")

let expo = new Expo()

const app = express()

//middlewares
app.use(cors())
app.use(express.json())
app.use(logger("dev"))

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
    console.log(`App listening on port ${PORT}`)
    console.log("Press Ctrl+C to quit.")
})

app.get("/", (req, res) => {
    res.send("Server Up!")
})

app.post("/send-notifications", async (req, res) => {

    const uid = req.body.uid

    console.log({uid})

    if(!uid) {
        return res.status(400).send("Invalid Request")
    }

    const resp = await getPatientInfo(uid)

    if(!resp) {
        return res.status(400).send("Invalid Request")
    }

    console.log({resp})

    const {medicId} = resp

    const tokens = await getDoctorsTokens(medicId)

    console.log({tokens})

    if(tokens.length === 0) {
        return res.status(200).send("No tokens found")
    }

    let messages = []

    for (let pushToken of tokens) {
        //Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
          console.error(`Push token ${pushToken} is not a valid Expo push token`);
          continue;
        }
      
        messages.push({
          to: pushToken,
          sound: 'default',
          body: 'This is a test notification',
          data: { patientUid: uid},
        })
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

    res.status(200).send("Notifications sent")
})