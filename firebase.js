require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require(`./config/${process.env.SDK_PATH}`);
console.log(process.env.SDK_PATH);

const defaultApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL,
  messagingSenderId: process.env.SENDER_ID,
});

const db = admin.firestore();
const messaging = admin.messaging();

async function sendNotif(tokens, msg = 'Terjadi gempa!!!') {
  // These registration tokens come from the client FCM SDKs.
  const registrationTokens = tokens.map((i) => i.token);

  const message = {
    notification: {
      title: 'Alert!!!',
      body: msg,
    },
    tokens: registrationTokens,
  };

  const response = await messaging.sendMulticast(message);

  if (response.failureCount > 0) {
    const failedTokens = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        failedTokens.push(registrationTokens[idx]);
      }
    });

    failedTokens.forEach((i) => {
      const { id } = tokens.find(({ token }) => token === i);
      const res = db.collection('tokens').doc(id).delete();
    });
  }
}

async function getTokens() {
  let tokens = [];

  const tokenRef = db.collection('tokens');
  const snapshot = await tokenRef.get();
  snapshot.forEach((doc) => {
    const data = {
      id: doc.id,
      token: doc.data().token,
    };
    tokens.push(data);
  });

  return tokens;
}

async function notif(msg) {
  const tokens = await getTokens();
  await sendNotif(tokens, msg);
}

module.exports = { notif };
