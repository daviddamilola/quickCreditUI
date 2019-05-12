/* eslint linebreak-style: ["error", "windows"] */
import express from 'express';
import AuthHandler from '../../controllers/authHandler';
// import UsersHandler from '../../controller/usersController';
// import LoansHandler from '../../controller/LoansController';
const app = express.Router();

// Home page route.
app.get('/auth/signup', AuthHandler.reqSignup);
app.post('/auth/signup', AuthHandler.createUser);
app.get('/auth/signin', AuthHandler.reqSignin);
app.post('/auth/signin', AuthHandler.login);

export default app;
