/*
Date retrieved: 14 Jan 2024
Description: Login credentials required for MySQL queries
Source: Copied from CS340 Activity 2 instructions with minor modifications
Source URL: https://canvas.oregonstate.edu/courses/1946034/assignments/9456203
*/

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'USERNAME',
    password        : 'PASSWORD',
    database        : 'DATABASE'
})

// Export it for use in our application
module.exports.pool = pool;