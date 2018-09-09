//This code is for setting up the db locally.
const { Pool } = require('pg');

const pool = new Pool({
    user: 'CarnetUser',
    host: 'localhost',
    database: 'Carnet',
    password: 'CarnetPassword',
    port: 5432,
});


function create_table() {
    pool.query('CREATE TABLE Users (userName VARCHAR(32) PRIMARY KEY, userPassword VARCHAR(32) not null)', (err, res) => {
        console.log(err, res)
        pool.query('INSERT INTO Users (index, key, value) VALUES ("test","test1")', (err, res) => {
            console.log(err, res)
            pool.end()
        })
    })
}

create_table();