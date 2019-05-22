/* eslint linebreak-style: ["error", "windows"] */
import express from 'express';
import AuthHandler from '../../controllers/userController';
import viewLoanHistory from '../../controllers/repayController';
import authenticate from '../../middleware/authenticate';
import LoansHandler from '../../controllers/loansController';
import Authorizer from '../../middleware/authorize';
import validator from '../../middleware/validate';
import authorizeAsAdmin from '../../middleware/authorizeAsAdmin';

const { checkIfAdmin } = authorizeAsAdmin;
const { authorize } = Authorizer;
const app = express.Router();

// Auth route.
app.get('/auth/signup', AuthHandler.reqSignup);

app.post('/auth/signup', validator.validateSignup, AuthHandler.createUser);

app.get('/auth/signin', validator.validateSignin, AuthHandler.reqSignin);

app.post('/auth/signin', AuthHandler.login);

app.get('/loans', authorize, authenticate, LoansHandler.reqLoan);

app.post('/loans', authorize, authenticate, validator.validateLoanApp, LoansHandler.applyForLoan);

app.get('/loans/:id/repayments', authorize, authenticate, viewLoanHistory.viewLoanHistory);

app.patch('/loans/:email/verify', validator.validateLoanApp, authorize, authenticate, checkIfAdmin, AuthHandler.verifyUser);

app.patch('/loans/:loanId', validator.checkstatus, authorize, authenticate, checkIfAdmin, LoansHandler.approveRejectLoan);

app.get('/loans/:loanId', validator.checkQuery, authorize, authenticate, checkIfAdmin, LoansHandler.viewSpecificLoan);

app.post('/loans/:loanId', validator.checkQuery, authorize, authenticate, checkIfAdmin, LoansHandler.makeRepayment);
export default app;
