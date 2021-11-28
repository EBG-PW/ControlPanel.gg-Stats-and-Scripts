const axios = require('axios');

//Convert to MB
function bytesToSize(bytes) {
    return (bytes/1024/1024).toFixed(2)
}

let GetPteroStatusData = function() {
	return new Promise(function(resolve, reject) {

        let ReturnData = {
            PS_CPULoad: 0,
            PS_MemoryUsage: 0,
            PS_MemoryTotal: 0,
            PS_DiskUsage: 0,
            PS_DiskTotal: 0,
        }

        if(process.env.PteroStatusToken) {
            const config = {
                headers: { Authorization: `Bearer ${process.env.PteroStatusToken}` }
            };
        
            axios.get( 
                `${process.env.PteroStatusURL}stats`,
                config
            ).then(function(values) {
                values.data.map(function(node) {
                    if(node.online === true) {
                        ReturnData.PS_CPULoad += node.cl*node.cpu.cores;
                        ReturnData.PS_MemoryUsage += node.memory.used;
                        ReturnData.PS_MemoryTotal += node.memory.total;
                        ReturnData.PS_DiskUsage += node.disk.used;
                        ReturnData.PS_DiskTotal += node.disk.total;
                    }
                });

                ReturnData.PS_MemoryUsage = Number(bytesToSize(ReturnData.PS_MemoryUsage));
                ReturnData.PS_MemoryTotal = Number(bytesToSize(ReturnData.PS_MemoryTotal));
                ReturnData.PS_DiskUsage = Number(bytesToSize(ReturnData.PS_DiskUsage));
                ReturnData.PS_DiskTotal = Number(bytesToSize(ReturnData.PS_DiskTotal));

                resolve(ReturnData)
            }).catch(function(error) {
                reject(error);
            });
        }else{
            axios.get( 
                `${process.env.PteroStatusURL}stats`
            ).then(function(values) {
                values.data.map(function(node) {
                    if(node.online === true) {
                        ReturnData.PS_CPULoad += node.cl*node.cpu.cores;
                        ReturnData.PS_MemoryUsage += node.memory.used;
                        ReturnData.PS_MemoryTotal += node.memory.total;
                        ReturnData.PS_DiskUsage += node.disk.used;
                        ReturnData.PS_DiskTotal += node.disk.total;
                    }
                });

                ReturnData.PS_MemoryUsage = Number(bytesToSize(ReturnData.PS_MemoryUsage));
                ReturnData.PS_MemoryTotal = Number(bytesToSize(ReturnData.PS_MemoryTotal));
                ReturnData.PS_DiskUsage = Number(bytesToSize(ReturnData.PS_DiskUsage));
                ReturnData.PS_DiskTotal = Number(bytesToSize(ReturnData.PS_DiskTotal));

                resolve(ReturnData)
            }).catch(function(error) {
                reject(error);
            });
        }
    });
}

module.exports = {
    GetPteroStatusData
}