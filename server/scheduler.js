import cron from "node-cron";
import fs from "fs";  
import { valentineTemplates } from "./templates.js";
import { sendMail } from "./mailer.js";

export function startScheduler() {

  cron.schedule("0 10 * * *", async () => {

    const users = JSON.parse(fs.readFileSync("users.json"));

    for (const user of users) {

      if (user.nextIndex >= valentineTemplates.length) continue;

      const t = valentineTemplates[user.nextIndex];
      await sendMail(user.email, t.subject, t.text);

      user.nextIndex++;
    }

    fs.writeFileSync("users.json", JSON.stringify(users,null,2));
    console.log("Daily batch sent");
  });

}