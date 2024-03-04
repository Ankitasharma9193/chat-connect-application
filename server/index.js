const express = require('express');
const cors = require('cors');

const authRouters = require('./routes/auth.js')

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

app.get('/', (rq, res) => {
    res.send('i am reunning');
})
// stream is going to trigger a specific endpoint on our server and then we will be able to send message
//the endpoint will be app.post

app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;

    if(type === 'message.new'){
        members
            .filter((member) => member.user_id !== sender.id) // no need to send message to ourselves
            //sender should not be receiver
            .forEach(( { user }) => {
                if(!user.online) { // send sms only if the user is offline
                    twilioClient.messages.create({
                        body: `You have a new message from ${message.user.fullName} - ${ message.text }`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    })
                    .then(() => console.log( 'Message sent!' ))
                    .catch((err) => console.log( err ));
                }
            })
            res.status(200).send('Message sent!');
    }
    return res.status(200).send('Not a new message request!');
})

app.use('/auth', authRouters ) // these routes are added to our server

app.listen(PORT, () => console.log(`server is running on ${PORT}`));