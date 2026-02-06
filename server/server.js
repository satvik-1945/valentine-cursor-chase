import express from "express";
import cors from "cors";
import { startScheduler } from "./scheduler.js";
import { getValentineIndex } from "./dateHelper.js";
import { valentineTemplates } from "./templates.js";
import { sendMail } from "./mailer.js";
import rateLimit from "express-rate-limit";

const app = express();
import fs from "fs";

if (!fs.existsSync("users.json")) {
  fs.writeFileSync("users.json", "[]");
}

app.use(cors({
  origin: "*",  
}));
app.use(express.json());

let emails =[];

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many signups — chill 😄"
});

app.post("/save-email", async (req, res) => {
  const { email } = req.body;
  const users = JSON.parse(fs.readFileSync("users.json"));
  if (users.find(u => u.email === email)) {
    return res.status(409).send("you already registered, no need to break my heart again 💔");
  }

  const startIndex = getValentineIndex();
  if(startIndex === null) return res.status(400).send("Not the right time to save emails"); 

  //send Immediately the email of the day
  const t = valentineTemplates[startIndex];
  await sendMail(email, t.subject, t.text);

  users.push({
    email,
    nextIndex : startIndex + 1
  });

  fs.writeFileSync("users.json", JSON.stringify(users,null,2));

  res.send("First mail sent!");
});

startScheduler(emails);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log("Server running"));
