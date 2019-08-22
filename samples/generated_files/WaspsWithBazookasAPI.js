const fasq = require('fasquest');
var hostUrl = '';
class WaspsWithBazookas {
    constructor() {}

    static get Wasp() {
        return Wasp;
    }

    static get Wasps() {
        return Wasps;
    }

    static get Hive() {
        return Hive;
    }
}
class Wasp {
    constructor() {}

    static async Boop() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `boop`,
        };
        return await fasq.request(options)
    }

    static async Die() {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `die`,
        };
        return await fasq.request(options)
    }

    static async Fire(body) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `fire`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }
}
class Wasps {
    constructor() {}

    static async WaspList() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `wasp/list`,
            json: true,
        };
        return await fasq.request(options)
    }

    static async WaspBoopSnoots() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `wasp/boop/snoots`,
        };
        return await fasq.request(options)
    }

    static async WaspHeartbeatPort(port) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `wasp/heartbeat/${port}`,
            json: true,
        };
        return await fasq.request(options)
    }

    static async WaspCheckinPort(port) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `wasp/checkin/${port}`,
            json: true,
        };
        return await fasq.request(options)
    }

    static async WaspReportinIdFailed(body, id) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `wasp/reportin/${id}/failed`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }

    static async WaspReportinId(body, id) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `wasp/reportin/${id}`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }
}
class Hive {
    constructor() {}

    static async HiveStatusDone() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `hive/status/done`,
            json: true,
        };
        return await fasq.request(options)
    }

    static async HiveStatusReportField(field) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `hive/status/report/${field}`,
            json: true,
        };
        return await fasq.request(options)
    }

    static async HiveStatusReport() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `hive/status/report`,
            json: true,
        };
        return await fasq.request(options)
    }

    static async HiveStatus() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `hive/status`,
            json: true,
        };
        return await fasq.request(options)
    }

    static async HiveSpawnLocalAmount(amount) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `hive/spawn/local/${amount}`,
        };
        return await fasq.request(options)
    }

    static async HiveTorchLocal() {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `hive/torch`,
            json: true,
        };
        return await fasq.request(options)
    }

    static async HiveTorch() {
        var options = {
            method: 'DELETE',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `hive/torch`,
        };
        return await fasq.request(options)
    }

    static async HivePoke(body) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `hive/poke`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }
}
module.exports = function(host) {
    hostUrl = host;

    return WaspsWithBazookas;
}
