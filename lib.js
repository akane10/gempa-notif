const he = require('he');
const axios = require('axios');
const fs = require('fs').promises;

const fetchData = async () => {
  const url = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml';
  const res = await axios.get(url);

  return res.data;
};

const options = {
  attributeNamePrefix: '@_',
  attrNodeName: 'attr', //default is 'false'
  textNodeName: '#text',
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: true,
  cdataTagName: '__cdata', //default is 'false'
  cdataPositionChar: '\\c',
  parseTrueNumberOnly: false,
  arrayMode: false, //"strict"
  attrValueProcessor: (val, attrName) =>
    he.decode(val, { isAttributeValue: true }), //default is a=>a
  tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
  stopNodes: ['parse-me-as-string'],
};

const readLast = async () => {
  const curDir = process.cwd();
  const data = await fs.readFile(`${curDir}/last.json`, 'utf8');

  return JSON.parse(data);
};

const writeLast = async (data) => {
  const curDir = process.cwd();
  await fs.writeFile(`${curDir}/last.json`, data);
};

module.exports = { fetchData, options, readLast, writeLast };

// jsonObj {
//   Infogempa: {
//     gempa: {
//       Tanggal: '17-Jul-20',
//       Jam: '09:50:23 WIB',
//       point: [Object],
//       Lintang: '7.82 LS',
//       Bujur: '147.70 BT',
//       Magnitude: '7.3 SR',
//       Kedalaman: '87 Km',
//       _symbol: 'imagesSWF/k3b.swf',
//       Wilayah1: '192 km TimurLaut PORTMORESBY-PNG',
//       Wilayah2: '656 km Tenggara WEWAK-PNG',
//       Wilayah3: '797 km TimurLaut MERAUKE-PAPUA',
//       Wilayah4: '973 km Tenggara JAYAPURA-PAPUA',
//       Wilayah5: '4545 km Tenggara JAKARTA-INDONESIA',
//       Potensi: 'tidak berpotensi TSUNAMI'
//     }
//   }
// }
