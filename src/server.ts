import { Server } from "http";
// import app from './app'

import express from "express";
const app = express();

const port = 5000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log("Sever is running on port ", port);
  });
}

main();
