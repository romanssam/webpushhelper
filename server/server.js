const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const webpush = require('web-push');
const bodyParser = require('body-parser')

dotenv.config()

const app = express()
app.use(bodyParser.json())
app.use(cors())

const publicVapidKey = process.env.PUBLIC_VAPID_KEY
const privateVapidKey = process.env.PRIVATE_VAPID_KEY

console.log({publicVapidKey, privateVapidKey})

webpush.setVapidDetails('mailto:uarenotalone@yandex.ru', publicVapidKey, privateVapidKey);

app.get('/', async(req, res) => {
  res.status(200).send({
    message: 'Good'
  })
})

app.post('/subscribe', async (req, res) => {
  try {
    const subscription = req.body;

    res.status(200).json({subscription});

    const payload = JSON.stringify({
      title: 'Test title',
      body: 'This is a test notification'
    });

    webpush.sendNotification(subscription, payload).catch(err => console.error(err));
  } catch(e) {
    res.status(500).send({
      e
    })
  }
});

app.listen(process.env.PORT, () => console.log(`server started at ${process.env.PORT} port, http://localhost:3000`))