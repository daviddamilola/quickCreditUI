/* eslint linebreak-style: ["error", "windows"] */
import express from 'express';
import AuthHandler from '../../controllers/userController';
import authenticate from '../../middleware/authenticate';
import LoansHandler from '../../controllers/loansController';
import Authorizer from '../../middleware/authorize';
import validator from '../../middleware/validate';
import authorizeAsAdmin from '../../middleware/authorizeAsAdmin';
import RepaymentController from '../../controllers/repayController';
import prevAdminApply from '../../middleware/prevAdminApply';

const { checkIfAdmin } = authorizeAsAdmin;
const { authorize } = Authorizer;
const app = express.Router();

// Auth route.
app.get('/auth/signup', AuthHandler.reqSignup);

app.post('/auth/signup', validator.validateSignup, AuthHandler.createUser);

app.get('/auth/signin', validator.validateSignin, AuthHandler.reqSignin);

app.post('/auth/signin', AuthHandler.login);

app.get('/loans', authorize, authenticate, checkIfAdmin, LoansHandler.reqLoan);

app.post('/loans', authorize, authenticate, prevAdminApply, LoansHandler.applyForLoan);

app.get('/loans/:loanId/repayments', authorize, authenticate, checkIfAdmin, validator.checkQuery, RepaymentController.viewLoanHistory);

app.patch('/users/:email/verify', authorize, authenticate, checkIfAdmin, AuthHandler.verifyUser);

app.patch('/loans/:loanId', validator.checkstatus, authorize, authenticate, checkIfAdmin, LoansHandler.approveRejectLoan);

app.get('/loans/:loanId', validator.checkQuery, authorize, authenticate, checkIfAdmin, LoansHandler.viewSpecificLoan);

app.post('/loans/:loanId', validator.checkQuery, authorize, authenticate, checkIfAdmin, RepaymentController.makeRepayment);
export default app;
