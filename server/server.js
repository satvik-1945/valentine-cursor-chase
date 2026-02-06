import express from "express";
import cors from "cors";
import { startScheduler } from "./scheduler.js";
import { getValentineIndex } from "./dateHelper.js";
import { valentineTemplates } from "./templates.js";
import { sendMail } from "./mailer.js";
import rateLimit from "express-rate-limit";


const app = express();
app.use(cors());
app.use(express.json());

let emails =[];

const signupLimiter = reateLimit({
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
  await sendMail(email, t.subject, t.body);

  users.push({
    email,
    nextIndex : startIndex + 1
  });

  fs.writeFileSync("users.json", JSON.stringify(users,null,2));

  res.send("First mail sent!");
});

startScheduler(emails);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});