//This code is for setting up the db locally.

let bcrypt = require('bcrypt');
const { Pool, } = require('pg');

const connectionString = process.env.DB_URL;

const pool = new Pool({
    connectionString: connectionString,
});

const Insert_user = new Pool({
    connectionString: connectionString,
});

const feedback = new Pool({
    connectionString: connectionString,
});

const Insert_data = new Pool({
    connectionString: connectionString,
});

const notebook = new Pool({
    connectionString: connectionString,
});

const create_user_table = 'CREATE TABLE Users (userName VARCHAR(32) PRIMARY KEY, password text not null, email text not null, securityQuestion text not null, securityAnswer text not null, name text not null, notebooks text not null)';
const insert_user = 'INSERT INTO Users (userName, password, email , securityQuestion, securityAnswer, name, notebooks) VALUES (\'testUsername\',\'$2b$10$PhtMAduAs2i0wI/Uvs6DIepGMjz2JjooKNoDZ1dbYMweuWHGbleQK\', \'test@test.com\', \'what my name?\', \'test answer\', \'test test\', \'notebooks\')';
const create_feedback_table = 'CREATE TABLE Feedback (feedbackText text)';
const create_notebook_table = 'CREATE TABLE Notebook (userName VARCHAR(32), name text not null, files text not null, subscribedBy text not null, likes NUMERIC not null, dislikes Numeric not null, uuid UUID not null)';


function create_user_table_function() {
    pool.query(create_user_table, (err, res) => {
        pool.end();

        Insert_user.query(insert_user, (err, res) => {
            Insert_data.end();
        });

    });
}

function create_feedback_table_function() {
    feedback.query(create_feedback_table, (err, res) => {
        feedback.end();
    });
}

function create_notebook_table_function() {
    notebook.query(create_notebook_table, (err, res) => {
        notebook.end();
    });
}

create_user_table_function();
create_feedback_table_function();
create_notebook_table_function();