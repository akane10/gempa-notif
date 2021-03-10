const webpush = require("web-push");
const { publicKey, privateKey } = require("./config/vapid_keys.json");

const pushSubscription = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/dME_c-O91wI:APA91bEblegBXI1Pkblr_s64AtASHcSxt61nG44LzYl1OfVL1mKJy4HaJ1jYjp2Gg_zM-kOcE1onZZU6XwJiUps-PcXnBauhli0UbxKNuWobGrsSwf3KCuUTzRCVSZXC66QVi-rIU_Ky",
  keys: {
    p256dh:
      "BFFJhnD7MeDfDrCFUumP8VmsdaZeEtv2VMOtMaBCNWGkvmHvFLz5dX6MTuaTyx1ryt1pokvJss6h5FQg8pABmrM=",
    auth: "Gw2z245Ogo9zKp+J/EehoA==",
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
      console.log("delete endpoint");
    }
  }
}

module.exports = { notif };
