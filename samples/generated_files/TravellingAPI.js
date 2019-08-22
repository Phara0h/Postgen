const fasq = require('fasquest');
var hostUrl = '';
class Travelling {
    constructor() {}

    static async healthCheck() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/_health`,
        };
        return await fasq.request(options)
    }

    static async metrics() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/metrics`,
        };
        return await fasq.request(options)
    }

    static get User() {
        return User;
    }

    static get Groups() {
        return Groups;
    }

    static get Auth() {
        return Auth;
    }
}
class User {
    constructor() {}

    static async getAllUsers() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/users`,
        };
        return await fasq.request(options)
    }

    static async getUserPropertyByIdWithResolvedGroup(id, prop) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/resolve/group/id/${id}/${prop}`,
        };
        return await fasq.request(options)
    }

    static async getUser_PropertyById(id, prop) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}/${prop}`,
        };
        return await fasq.request(options)
    }

    static async getUserPropertyByUsernameWithResolvedGroup(username, prop) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/resolve/group/username/${username}/${prop}`,
        };
        return await fasq.request(options)
    }

    static async getUserPropertyByUsername_(username, prop) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}/${prop}`,
        };
        return await fasq.request(options)
    }

    static async getUserByIdWithResolvedGroup(id) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/resolve/group/id/${id}`,
        };
        return await fasq.request(options)
    }

    static async getUserById(id) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/id/${id}`,
        };
        return await fasq.request(options)
    }

    static async getUserByUsernameWithResolvedGroup(username) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/resolve/group/username/${username}`,
        };
        return await fasq.request(options)
    }

    static async getUserByUsername(username) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/username/${username}`,
        };
        return await fasq.request(options)
    }

    static get Current() {
        return Current;
    }
}
class Current {
    constructor() {}

    static async getUserProperty(property) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/${property}`,
        };
        return await fasq.request(options)
    }

    static async routeCheck(method, route) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/route/allowed`,
            qs: {
                method,
                route
            },
        };
        return await fasq.request(options)
    }

    static async permissionCheck(permission) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me/permission/allowed/${permission}`,
        };
        return await fasq.request(options)
    }

    static async getUser(body) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/user/me`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }
}
class Groups {
    constructor() {}

    static async getTypesList() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups/types`,
        };
        return await fasq.request(options)
    }

    static async getGroupsOfAType(type) {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups/type/${type}`,
        };
        return await fasq.request(options)
    }

    static async getAllGroups() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/groups`,
        };
        return await fasq.request(options)
    }

    static async addRouteToGroup(body, groupname) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/${groupname}/route`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }

    static async editGroup(body) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group/superadmin`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }

    static async addGroup(body) {
        var options = {
            method: 'PUT',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/group`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }
}
class Auth {
    constructor() {}

    static async logout() {
        var options = {
            method: 'GET',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/logout`,
        };
        return await fasq.request(options)
    }

    static async login(body) {
        var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/login`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }

    static async registerUser(body) {
        var options = {
            method: 'POST',
            resolveWithFullResponse: true,
            simple: false,
            uri: hostUrl + "/" + `travelling/api/v1/auth/register`,
            body,
            json: true,
        };
        return await fasq.request(options)
    }
}
module.exports = function(host) {
    hostUrl = host;

    return Travelling;
}
