const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const signup = async (req, res) => { //creation
    console.log('I am in signup');
    try {
        const { fullName, username, password, phoneNumber } = req.body;

        const userId = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await bcrypt.hash(password, 10);
        // connection to stream
        const serverClient = connect(api_key, api_secret, app_id);
        const token = serverClient.createUserToken(userId);
       //! creating a random userId -> with random userID we are creating a token
        res.status(200).json({ token, fullName, username, phoneNumber, userId, hashedPassword });

    } catch (error){
        res.status(500).json({ message: error });
    }
};

const login = async (req, res) => { //fetching 
    try{
       const {username, password} =  req.body;

        const serverClient = connect(api_key, api_secret, app_id);
        const clientInstance = StreamChat.getInstance(api_key, api_secret);
        // query user from database which matches the username
        // users is the array we are getting from backend thus has to be name 'users'
        const { users } = await clientInstance.queryUsers({ name: username });
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~',{users})
        // entry not in database
        if(!users.length) return res.status(400).json({ message :`User not found with username ${username}` });
        
        //entry found in databse
            // compare the decrypted pass with current pass
        const success = await bcrypt.compare(password, users[0].hashedPassword);
        // create new usertoken
         //! here also we are  creating a token using the userID, but here user already has userID
         //! this user id is been created at the time of signup, refer LINE 16
        const token = serverClient.createUserToken(users[0].id);

        if(success){
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id });
        } else {
            res.status(400).json({ message: `Incorrect password` });
        }

    } catch (error) {
        res.status(500).json({ message: error})
    }
};

module.exports = { signup, login };