const StatsCollector = require('./collectStats');
/*
const Influxdb = require('influxdb-v2');
*/
/*
const db = new Influxdb({
	host: process.env.Influx_Host,
	protocol: process.env.Influx_Protocol,
	port: process.env.Influx_Port,
	token: process.env.Influx_Token
});
*/

StatsCollector.StatsCollector().then(function(result) {
    console.log(result);
});