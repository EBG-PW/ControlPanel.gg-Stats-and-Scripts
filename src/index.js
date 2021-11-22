const { StatsCollector } = require('./collectStats');

const Influxdb = require('influxdb-v2');

const db = new Influxdb({
	host: process.env.Influx_Host,
	protocol: process.env.Influx_Protocol,
	port: process.env.Influx_Port,
	token: process.env.Influx_Token
});

async function writeDatapoint(key, value) {
    await db.write(
        {
            precision: 's',
            bucket: process.env.bucket,
            org: process.env.orga
        }, [{
            measurement: key,
            tags: {host: process.env.host},
            fields: value
        }]
    )
}

function gather_and_save_stats() {
    StatsCollector().then(function(result) {
        for (const [key, value] of Object.entries(result)) {
            writeDatapoint(key, value);
        }
        console.log('Stats saved');
    });
}
gather_and_save_stats();
setInterval(gather_and_save_stats, process.env.CheckDelayInMS);