const webpush = require("web-push");
const redis = require("redis");
const { promisify } = require("util");

const { publicKey, privateKey } = require("./config/vapid_keys.json");
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const delAsync = promisify(client.del).bind(client);
const keysAsync = promisify(client.keys).bind(client);

function safelyParseJSON(json) {
  let parsed;

  try {
    parsed = JSON.parse(json);
  } catch (e) {
    return null;
  }

  return parsed; // Could be undefined!
}

async function notif(msg) {
  try {
    const keys = await keysAsync("*");
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const val = await getAsync(key);

      const x = safelyParseJSON(val);
      console.log({ x });
      if (x && x.endpoint) {
        const pushSubscription = {
          endpoint: x.endpoint,
          keys: {
            p256dh: x.p256dh,
            auth: x.auth,
          },
        };

        const options = {
          vapidDetails: {
            subject: "mailto:example_email@example.com",
            publicKey: await getAsync("public_key"),
            privateKey: await getAsync("private_key"),
          },
          TTL: 60,
        };
        await webpush
          .sendNotification(pushSubscription, msg, options)
          .catch((e) => {
            console.log("sendNotification errrr!!! ", e);
            const { statusCode, endpoint } = e;
            if (statusCode == 410) {
              delAsync(key);
            } else {
              throw new Error(e);
            }
          });
        console.log("pushed", x.endpoint);
      }
    }
  } catch (e) {
    console.log("push errrr!!! ", e);
    throw new Error(e);
  }
}

module.exports = { notif };