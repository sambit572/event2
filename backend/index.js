import { config } from "dotenv";

import "dotenv/config";

import { app } from "./app.js";

import { connectToDb } from "./db/db.js";

config({ path: "./env" });

app.on("error", (error) => {
  console.log(`ERRR: ${error}`);
  throw error;
});

let port = process.env.PORT || 8000

connectToDb().then(()=>{
    app.listen(port, () => {
        console.log(`connected on ${port}`);
      });
}).catch((err)=>{
    console.log(`err:${err}`)
})
