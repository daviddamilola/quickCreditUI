/* eslint linebreak-style: ["error", "windows"] */
import express from 'express';
import AuthHandler from '../../controllers/authHandler';
import viewLoanHistory from '../../controllers/repayHandler';
import authenticate from '../../middleware/authenticate';
import LoansHandler from '../../controllers/loansHandler';
import Authorizer from '../../middleware/authorize';

const { authorize } = Authorizer;
const app = express.Router();

// Auth route.
app.get('/auth/signup', AuthHandler.reqSignup);

app.post('/auth/signup', AuthHandler.createUser);

app.get('/auth/signin', AuthHandler.reqSignin);

app.post('/auth/signin', AuthHandler.login);

// user apply loan
// authenticate that user exist then render the apply loan page
app.get('/loans', authorize, authenticate, LoansHandler.reqLoan);
// user post loan application, authenticate user then post loan application to loan db
app.post('/loans', authorize, authenticate, LoansHandler.applyForLoan);
// user can view loan history
app.get('/loans/:id/repayments', authorize, authenticate, viewLoanHistory.viewLoanHistory);
// admin can verify user
// app.patch('/api/v1/users/:email/verify', Authhandler.VerifyUser);
export default app;
