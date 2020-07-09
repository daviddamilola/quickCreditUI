// import dotenv from 'dotenv';
// import nodemailer from 'nodemailer';
// import { google } from 'googleapis';


// const { auth: { OAuth2 } } = google.auth.OAuth2;

// const {
//   env: {
//     CLIENT_ID, CLIENT_SECRET, EMAIL, REFRESH,
//   },
// } = process;

// dotenv.config();


// const myOAuth2Client = new OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
// );

// myOAuth2Client.setCredentials({
//   refresh_token: REFRESH,
// });

// const myAccessToken = myOAuth2Client.getAccessToken();

// const transport = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: EMAIL, // your gmail account you used to set the project up in google cloud console'
//     clientId: CLIENT_ID,
//     clientSecret: CLIENT_SECRET,
//     refreshToken: REFRESH,
//     accessToken: myAccessToken, // access token variable we defined earlier
//   },
// });
