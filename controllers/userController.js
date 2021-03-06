const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const OAUTH_CLIENT_ID = '492476132258-0q398eovgf4m37gal1t3vgm6ohnf49q4.apps.googleusercontent.com';

const client = new OAuth2Client(OAUTH_CLIENT_ID);

exports.findOrCreateUser = async token => {
  const googleUser = await verifyToken(token);
  const user = await checkIfUserExists(googleUser.email);
  return user ? user : createNewUser(googleUser);
}

const verifyToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID,
    })
    return ticket.getPayload();
  } catch (err) {
    console.error('fail auth token', err);
  }
}

const checkIfUserExists = async email => await User.findOne({ email }).exec();
const createNewUser = googleUser => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  return new User(user).save();
};