const userQueryModel = {
  createUsersTable: `CREATE TABLE IF NOT EXISTS users
                  ( id  SERIAL PRIMARY KEY,
                  email varchar(30) UNIQUE NOT NULL,
                  firstname text NOT NULL,
                  lastname text NOT NULL,
                  phonenumber char(13) UNIQUE NOT NULL,
                  password varchar(256) NOT NULL,
                  address varchar(256) NOT NULL,
                  status text NOT NULL,
                  createdon timestamp DEFAULT Now(),
                  isadmin boolean NOT NULL DEFAULT false,
                  modifiedon TIMESTAMP NOT NULL DEFAULT Now());
                  `,
  createLoansTable: `CREATE TABLE IF NOT EXISTS loans
                  ( id         SERIAL PRIMARY KEY,
                  createdon    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  users        text NOT NULL,
                  status      text NOT NULL,
                  repaid      boolean NOT NULL DEFAULT false,
                  tenor       int NOT NULL CHECK (tenor <= 12),
                  amount      float   NOT NULL,
                  paymentinstallment float NOT NULL,
                  balance     float NOT NULL,
                  interest    float NOT NULL);
                  `,
    createNotificationsTable: `CREATE TABLE IF NOT EXISTS notifications
                      ( id         SERIAL PRIMARY KEY,
                      createdon    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      users        text NOT NULL,
                      detail       text NOT NULL,
                      read         boolean NOT NULL DEFAULT false,
                      readTime     TIMESTAMP);
                      `,
    alterNotificationsTable: `ALTER TABLE notifications 
                      ADD CONSTRAINT fk_notifications_users FOREIGN KEY (users) REFERENCES users(email);`,
  alterLoansTable: `ALTER TABLE loans 
                      ADD CONSTRAINT fk_loans_users FOREIGN KEY (users) REFERENCES users(email);`,
  alterRepaymentTable: `ALTER TABLE repayments 
                      ADD CONSTRAINT fk_repayments_loans FOREIGN KEY (loanid) REFERENCES loans(id);`,


  createRepaymentTable: `CREATE TABLE IF NOT EXISTS repayments
                  ( id         SERIAL PRIMARY KEY,
                    loanid      int   NOT NULL,
                  createdon   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  repaid      boolean NOT NULL DEFAULT false,
                  amount      float  NOT NULL,
                  balance     float NOT NULL,
                  monthlyInstallment float  NOT NULL,
                  amountpaid  float NOT NULL);
                  `,

  createuser: 'INSERT INTO users (firstname, lastname, password, email, address,phonenumber, isadmin, status) VALUES ($1, $2, $3, $4, $5,$6,$7,$8) RETURNING *',
  createLoanApplication: 'INSERT INTO loans (createdon, users, status, repaid, tenor, amount, paymentinstallment, balance, interest) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
  insertRepayment: 'INSERT INTO repayments (loanid, createdon, repaid, amount, balance, monthlyinstallment, amountpaid) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
  updateBalance: 'UPDATE loans SET balance = $1 WHERE id = $2 RETURNING balance',
  updateLoanStatus: 'UPDATE loans SET repaid = $1 WHERE id = $2 RETURNING *',
  selectUser: 'select * from users where email=$1 or phonenumber=$2',
  createNotification: 'INSERT INTO  notifications (users, detail) VALUES  ($1, $2)',
  updateNotification: 'UPDATE notifications SET read=$1 where id=$2',
  getWhere: 'SELECT * FROM notifications where read=$1 and users=$2 RETURNING *',
  getAllNotification: 'SELECT * FROM notifications where users=$1',
};

export default userQueryModel;
