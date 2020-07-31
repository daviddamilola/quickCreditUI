export default {
  verifyAccount: {
    subject: 'Verify your account',
    body: `
    <h1>  hi {{user}}, </h1>
    <p> welcome to quickcredit </p>
    <p> click on the following link to activate your account {{link}} </p>
    <p> sincerely </p>
    <h5>Quickcredit team </h5>
    `,
  },
  approvedLoan: {
    subject: 'Your loan has been approved',
    body: `
    <h1>  hi {{user}}, </h1>
    <p> your loan application for {{amount}} has been approved</p>
    <p> you are to pay the sum of {{installment}} every month</p>
    <p> sincerely </p>
    <h5>Quickcredit team </h5>
    `,
  },
  loanRequest: {
    subject: 'Successful loan request',
    body: `
    <h1>  hi {{user}}, </h1>
    <p> your loan request has been received, and is currently undergoing review </p>
    <p> You would be contacted once the request has been approved </p>
    <p> sincerely </p>
    <h5>Quickcredit team </h5>
    `,
  },
  adminLoanRequest: {
    subject: 'New loan request',
    body: `
    <h1>  hi {{admin}}, </h1>
    <p> A loan request by {{user}} has been made</p>
    <p> click on the link below to begin processing</p>
    <a href='{{link}}'> View loan detail </a>
    <p> sincerely </p>
    <h5>Quickcredit team </h5>
    `,
  },
  passwordReset: {
    subject: 'Reset your password',
    body: `
    <h1>  hi {{user}}, </h1>
    <p> click on the link below to begin reset your password</p>
    <a href='{{link}}'> Reset your password </a>
    <p> sincerely </p>
    <h5>Quickcredit team </h5>
    `,
  },
};
