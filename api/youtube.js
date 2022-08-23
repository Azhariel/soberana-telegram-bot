const pshb = require('pubsubhubbub');

const channelId = `HistóriaPúblicaOficial`;
const topic = `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelId}`;

pshb.subscribe(topic, hub, callback);
