const fs = require("fs").promises;
const webpush = require("web-push");

const write = async () => {
  const curDir = process.cwd();
  const keys = webpush.generateVAPIDKeys();
  const data = { ...keys, created_at: new Date(Date.now()).toUTCString() };
  await fs.writeFile(`${curDir}/vapid_keys.json`, JSON.stringify(data, null, 2));
};
write();
