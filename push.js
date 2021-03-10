const webpush = require("web-push");
const { publicKey, privateKey } = require("./config/vapid_keys.json");

const pushSubscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/dBQb2e_0-Io:APA91bFTrsip6C6Pk3RPmsQvzG3jS1qCTG7EYLDbImx2gzp6P7XK5BcvskmNL4AL4saX-rTSyxViY7-eB-HHwlmrlRcoKwuzG17UdyO0vucLkRu5bb1s8Ls1sRENMxwCfBV5AP1-OF_O",
  keys: {
    p256dh:
      "BPbjeYHsAAVuniwlQmwqmITnXBzoFkVGe7sYcwec+RCnTlAoBbr6y/GiKoNE5SqyX+aBZLdgxpdQhsUcMWVFKzg=",
    auth: "5rBvidms489chB/D94AqAA==",
  },
};

const options = {
  vapidDetails: {
    subject: "mailto:example_email@example.com",
    publicKey,
    privateKey,
  },
  TTL: 60,
};

async function notif(msg) {
  try {
    const x = await webpush.sendNotification(pushSubscription, msg, options);
  } catch (e) {
    console.log("push errrr!!! ", e);
    const { statusCode, endpoint } = e;
    if (statusCode == 410) {
      // TODO: Delete endpoint in db
      console.log("delete endpoint");
    }
  }
}

module.exports = { notif };
