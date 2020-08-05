const parser = require('fast-xml-parser');
const { fetchData, options, readLast, writeLast } = require('./lib');
const { notif } = require('./firebase');

let lastDate = '';
let lastTime = '';

function setBodyMsg(obj) {
  const { Tanggal, Jam, Magnitude, Potensi } = obj;
  const wilayah = Object.entries(obj).reduce((acc, [key, val]) => {
    if (key.includes('Wilayah')) {
      acc.push(val);
    }

    return acc;
  }, []);

  return `Terjadi gempa 
jam ${Jam}
${Magnitude}
${Potensi}
Lokasi ${wilayah[0]}`;
}

(async function setDateandTime() {
  const { date, time } = await readLast();
  lastDate = date;
  lastTime = time;
})();

async function cron() {
  try {
    const xmlData = await fetchData();

    const jsonObj = parser.parse(xmlData, options, true);

    const now = jsonObj.Infogempa.gempa.Tanggal;
    const jam = jsonObj.Infogempa.gempa.Jam;

    if (now !== lastDate || jam !== lastTime) {
      lastDate = now;
      lastTime = jam;

      const str = JSON.stringify({ date: now, time: jam }, null, 2);
      await writeLast(str);
      await notif(setBodyMsg(jsonObj.Infogempa.gempa));
      // console.log('alert!!!', jsonObj);
    } else {
      // console.log('safe');
    }
  } catch (error) {
    console.log(error.message);
  }
}

setInterval(cron, 1000);
