const fs = require("fs").promises;
const redis = require("redis");
const { promisify } = require("util");
const webpush = require("web-push");

const client = redis.createClient();
const setAsync = promisify(client.set).bind(client);

const write = async () => {
  try {
    const curDir = process.cwd();
    const keys = webpush.generateVAPIDKeys();
    const data = { ...keys, created_at: new Date(Date.now()).toUTCString() };
    await setAsync("public_key", data.publicKey);
    await setAsync("private_key", data.privateKey);
    // await fs.writeFile(
      // `${curDir}/vapid_keys.json`,
      // JSON.stringify(data, null, 2)
    // );
    console.log("ok");
  } catch (e) {
    console.log(e);
  }
};
write();
