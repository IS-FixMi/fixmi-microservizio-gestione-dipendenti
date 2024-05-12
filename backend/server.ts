/*
 *   File: app.ts 
 *
 *   Purpose: this file contains the main code for the back-end server 
 *
 */ 


// Express
import express from 'express';
import bodyParser from "body-parser";
const cookieParser = require("cookie-parser");
import cors from "cors";
import createRouter from './routes/createRouter';
import deleteRouter from './routes/deleteRouter';
import findRouter from './routes/findRouter';
import historyRouter from './routes/historyRouter';




// Get variables from .env file
require('dotenv').config();


// Allow debug prints
export const DEBUG = true;


const app = express();
const port = process.env.REACT_APP_BACKEND_PORT || 3001;
export {port};


// ------------ AUTH SERVER -------------

export const AUTH_IP = process.env.MICROSERVIZIO_AUTH_IP || "10.5.0.11";



// ------------ MONGODB -------------

// Setup MongoDB
const {MongoClient} = require("mongodb");
let db_users;
let db_tasks;
const DB_USERNAME = process.env.MICROSERVIZIO_DB_USERNAME || "fixme";
const DB_PASSWORD = process.env.MICROSERVIZIO_DB_PASSWORD || "fixme";
const DB_IP = process.env.MICROSERVIZIO_DB_IP || "10.5.0.10";
const DB_PORT = "27017";
const DB_NAME = "Users";
const TASK_DB_NAME= "Tasks";
// Connect to the database
async function startDB() {
  const users_client = new MongoClient("mongodb://" + DB_USERNAME +
                                 ":" + DB_PASSWORD + "@"
                                 + DB_IP + ":" + DB_PORT +
                                 "/" + DB_NAME +"?&authSource=admin");
  const tasks_client = new MongoClient("mongodb://" + DB_USERNAME +
                                        ":" + DB_PASSWORD + "@"
                                        + DB_IP + ":" + DB_PORT +
                                         "/" + TASK_DB_NAME +"?&authSource=admin");
  // Let's wait for the connection
  await users_client.connect();
  await tasks_client.connect();
  // This return the database
  db_users = users_client.db();
  db_tasks=tasks_client.db();
}

startDB()

export { db_users };
export {db_tasks};


// ------------ SAME ORIGIN POLICY  -------------
//
// We need to disable Same Origin Policy since the 
// frontend and the backend run on different servers,
// the frontend must send requests to a server that 
// is not itself, breaking the SOP
//
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });



// ------------ MIDDLEWARE -------------
const options = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(cors(options));


// ------------------ ROUTES ------------------

app.use('/api/dipendenti/create', createRouter);
app.use('/api/dipendenti/delete',deleteRouter);
app.use('/api/dipendenti/find',findRouter);
app.use('/api/dipendenti/history',historyRouter);



// Run server
app.listen(port, () => {
  return console.log(`Express is listening at http://127.0.0.1:${port}`);
});
export function dbg(name, value) {
  if (!DEBUG) return;
  console.log("(DEBUG /api/tasks/getListaTaskDaEseguire) " + name + ": " + value);
}
