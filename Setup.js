//This code is for setting up the db locally.
const { Pool }= require('pg');

const connectionString = process.env.DB_URL;

const pool = new Pool({
    connectionString: connectionString,
});

const Insert_data = new Pool({
    connectionString: connectionString,
});


function create_table() {
    pool.query('CREATE TABLE Users (userName VARCHAR(32) PRIMARY KEY, password text not null, email text not null, securityQuestion text not null, securityAnswer text not null, name text not null, notebooks text not null)', (err, res) => {
        console.log(err);
        pool.end();
        Insert_data.query("INSERT INTO Users (userName, password, email , securityQuestion, securityAnswer, name, notebooks) VALUES ('testUsername','passwords', 'test@test.com', 'what my name?', 'test answer', 'test test', 'notebooks')", (err, res) => {
            console.log(err);
            Insert_data.end()
        });
    })
}

create_table();