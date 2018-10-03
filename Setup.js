//This code is for setting up the db locally.
let bcrypt = require('bcrypt');
const { Pool, } = require('pg');

const connectionString = process.env.DB_URL;

const pool = new Pool({
    connectionString: connectionString,
});

const Insert_data = new Pool({
    connectionString: connectionString,
});

const create_stmt = 'CREATE TABLE Users (userName VARCHAR(32) PRIMARY KEY, password text not null, email text not null, securityQuestion text not null, securityAnswer text not null, name text not null, notebooks text not null)';
const insert_stmt = 'INSERT INTO Users (userName, password, email , securityQuestion, securityAnswer, name, notebooks) VALUES (\'testUsername\',\'$2b$10$PhtMAduAs2i0wI/Uvs6DIepGMjz2JjooKNoDZ1dbYMweuWHGbleQK\', \'test@test.com\', \'what my name?\', \'test answer\', \'test test\', \'notebooks\')';

function create_table() {
    pool.query(create_stmt, (err, res) => {
        pool.end();

        Insert_data.query(insert_stmt, (err, res) => {
            Insert_data.end();
        });

    });
}

create_table();