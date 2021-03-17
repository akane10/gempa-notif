const webpush = require("web-push");
const redis = require("redis");
const { promisify } = require("util");

// const { publicKey, privateKey } = require("./config/vapid_keys.json");
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const delAsync = promisify(client.del).bind(client);
const keysAsync = promisify(client.keys).bind(client);

function safelyParseJSON(json) {
  try {
    const x = JSON.parse(json);
    return x;
  } catch (e) {
    return null;
  }
}

async function notif(msg) {
  try {
    const keys = await keysAsync("*");
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const val = await getAsync(key);

      const x = safelyParseJSON(val);
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
            console.log("sendNotification errrr!!! ", e.body || e);
            const { statusCode, endpoint } = e;
            if (statusCode == 410) {
              delAsync(key);
            } else {
              throw Error(e);
            }
          });
        console.log("pushed", x.endpoint);
      }
    }
  } catch (e) {
    // console.log("push errrr!!! ", e);
    throw Error(e);
  }
}

module.exports = { notif };
