#!/usr/bin/env node

const fs = require('fs') // needed to read JSON file from disk
const Collection = require('postman-collection').Collection;
const prettier = require("prettier");

// Load a collection to memory from a JSON file on disk (say, sample-collection.json)
var collection = new Collection(JSON.parse(fs.readFileSync(process.argv[2]).toString())).toJSON();
const web = process.argv[3] == 'web';
var allNewClasses = [];

var parentName = ''

var jsFile = `
'use strict';
`;

jsFile += web ? fs.readFileSync('node_modules/fasquest/dist/index.mjs', 'utf8') : fs.readFileSync('node_modules/fasquest/index.js', 'utf8');
jsFile.replace('var Fasquest_1=new Fasquest;export default Fasquest_1;', '');
parentName = collection.info.name;
var parseHeader = function (body,header = [])
{
  var params = body.length > 0 ? ',' : '';
  for (var i = 0; i < header.length; i++)
  {
    if (header[i].key == 'Content-Type' && header[i].value == 'application/json')
    {
      params += 'json:true,'
    }
    else if (header[i].key == 'Authorization' && header[i].value == 'Bearer')
    {
      params += `authorization:{
        bearer: authorization_bearer
      },`
    }
    else if (header[i].key == 'Authorization' && header[i].value == 'Basic')
    {
      params += `authorization: {basic: {
        client: authorization_client,
        secret: authorization_secret
      }},`
    }
  }

  return params;
}

var parseUrl = function (url)
{
  for (var i = 0; i < url.path.length; i++)
  {
    if (url.path[i].indexOf(':') > -1)
    {
      url.path[i] = '${' + url.path[i].replace(':', '') + '}';
    }
  }

  var uri = url.path.join('/')
  var params = `uri: hostUrl+"/" + ` + '`' + uri + '`'
    url.query = url.query.filter(v=>v.key)
  if (url.query.length > 0)
  {
    params += ', qs: { '
    for (var i = 0; i < url.query.length; i++)
    {
      params += i + 1 < url.query.length ? url.query[i].key + ',' : url.query[i].key;
    }
    params += '}'
  }

  return params;
}

var getVars = function (url, body, headers = [])
{
  var vars = [];

  var urlVars = Array.from(url.variable.map(v => v.key.length > 0 ? v.key : null)).filter(v=>v);
  if(urlVars.length > 0) {
    //console.log(urlVars)
    vars = [...vars, ...urlVars];
  }

  var queryVars = (Object.keys(url.query).length > 0 ? Array.from(url.query.map(v => v.key.length > 0 ? v.key : null)): []).filter(v=>v);
  if(queryVars.length > 0) {
    vars = [...vars, ...queryVars];
  }

//console.log(urlVars, queryVars)

  var bodyString = '';
  if(body) {
    if(body.mode == 'raw') {
       bodyString = 'body'
    }
    else if(body.mode == 'urlencoded') {
      vars = [...(vars.length> 0 ? vars: []),...Array.from(body.urlencoded.map(v => v.key.length > 0 ? v.key : null)).filter(v=>v)];
    }
  }

  var varsString = bodyString.length > 0 && vars.length > 0 ? ','+vars.join() : vars.join();

  var headerString = '';
var headerVars = []
  if(headers.length > 0) {


    for (var i = 0; i < headers.length; i++)
    {
      if (headers[i].key == 'Authorization' && headers[i].value == 'Bearer')
      {
        headerVars.push(`authorization_bearer`)
      }
      else if (headers[i].key == 'Authorization' && headers[i].value == 'Basic')
      {
        headerVars.push('authorization_client');
        headerVars.push('authorization_secret');
      }
    }

    headerString +=  ((vars.length > 0 || bodyString.length > 0) && headerVars.length > 0 ? ',' : '') + headerVars.join();
  }

  return  bodyString + varsString + headerString +(vars.length > 0 || body || headerVars.length > 0 ? ',opts' : 'opts');
}

var getDocs = function (name, description, url, body, headers = [])
{
  var docs =
  `
/**
  * ${setMethodName(name)} - ${description}
  *
  * Path: ${url.path.join('/')}`

  var vars = [];

  var pathVars = Array.from(url.variable.map(v => v.key.length > 0 ? v.key : null)).filter(v=>v);
  var queryVars = (Object.keys(url.query).length > 0 ? Array.from(url.query.map(v => v.key.length > 0 ? v.key : null)): []).filter(v=>v);
  var urlVars = [];

//console.log(urlVars, queryVars)

  var bodyString = '';

  if(body) {
    if(body.mode == 'raw') {
       docs +=
  `
  * @param {Object} body`
    }
  }

  var varsString = '';

for (var i = 0; i < url.variable.length; i++) {
  if(pathVars.indexOf(url.variable[i].key) > -1){
  docs +=
  `
  * @param {${url.variable[i].type || 'any'}} ${url.variable[i].key} ${url.variable[i].description ? url.variable[i].description.content : ''} ${url.variable[i].value? '(example: '+url.variable[i].value+')': ''}`
}
}
for (var i = 0; i < url.query.length; i++) {
  if(queryVars.indexOf(url.query[i].key) > -1){
  docs +=
  `
  * @param {${url.query[i].type || 'any'}} ${url.query[i].key} ${url.query[i].description ? url.query[i].description.content : ''} ${url.query[i].value? '(example: '+url.query[i].value+')': ''}`
  }
}
if(urlVars.length > 0) {
  if(urlVars.indexOf(body.urlencoded[i].key) > -1){
  for (var i = 0; i < body.urlencoded.length; i++) {
    docs +=
  `
  * @param {${body.urlencoded[i].type|| 'any'}} ${body.urlencoded[i].key} ${body.urlencoded[i].description ? body.urlencoded[i].description.content : ''} ${body.urlencoded[i].value? '(example: '+body.urlencoded[i].value+')': ''}`
  }
}

}

  if(headers.length > 0) {


    for (var i = 0; i < headers.length; i++)
    {
      if (headers[i].key == 'Authorization' && headers[i].value == 'Bearer')
      {
        docs +=
  `
  * @param {string} authorization_bearer ${headers[i].description.content}`
      }
      else if (headers[i].key == 'Authorization' && headers[i].value == 'Basic')
      {
        docs +=
  `
  * @param {string} authorization_client username/client_id
  * @param {string} authorization_secret password/client_secret`
      }
    }
  }



  if(body) {
    if(body.mode == 'raw') {
       docs +=
  `
  * @example
  * body
  * \`\`\`${body.options ? body.options.raw.language : ''}
  * `
  docs += body.raw.replace(/\n/g, '\n * ');
  docs += '\n  * ```';
    }
    else if(body.mode == 'urlencoded') {
      urlVars = Array.from(body.urlencoded.map(v => v.key.length > 0 ? v.key : null)).filter(v=>v);
    }
  }
  docs +=
  `
  */`
  //console.log(docs)
  return  docs;
}

var convertToOptions = function (request)
{
  var body = request.body;
  if(body) {
    if(body.mode == 'raw') {
       body = `body${body.options && body.options.raw.language == 'json' ? ',json:true' : ''}`
    }
    else if(body.mode == 'urlencoded') {
      body = `form: {
        ${Array.from(request.body.urlencoded.map(v => v.key.length > 0 ? v.key : null)).filter(v=>v).join()}
      }`
    }
    else {
          body = ''
    }

  } else {
    body = ''
  }
  var options = `{
    method: '${request.method}', simple: false, ${parseUrl(request.url)}, ${body} ${parseHeader(body || '',request.header)}
  }`;

  return options;
}


var setMethodName = function (n)
{
  var mn = '' + n
  return toCamel(mn.replace(/[\:\'\)\(]/g, '').replace(/[ \/\-]/g, '_').toLowerCase())
}

var setClassName = function (n, parent)
{
  var cn = (parent && parent != parentName ? parent+' ' : '') + n.charAt(0).toUpperCase() + n.slice(1);
  var name = toCamel(cn.replace(/[\'\)\(]/g, '').replace(/ /g, '_').toLowerCase())
  return name.charAt(0).toUpperCase() + name.slice(1);
}
const toCamel = (s) =>
{
  return s.replace(/([-_][a-z])/ig, ($1) =>
  {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

const isArray = function (a)
{
  return Array.isArray(a);
};

const isObject = function (o)
{
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const keysToCamel = function (o)
{
  if (isObject(o))
  {
    const n = {};

    Object.keys(o)
      .forEach((k) =>
      {
        n[toCamel(k)] = keysToCamel(o[k]);
      });

    return n;
  }
  else if (isArray(o))
  {
    return o.map((i) =>
    {
      return keysToCamel(i);
    });
  }

  return o;
};

var genClass = function (name, item, js, classObj, parent)
{

  var classEnd = false;
  allNewClasses.push(setClassName(name, parent));
  var newClasses = [];
  js += `
/**
  * ${classObj.description ? classObj.description.content.replace(/\n/g,
  `
  * `).replace(/\t/g,
  ` `) : ''}
 */
class ${setClassName(name, parent)} {
    constructor() {}`
    var getPathObject = `static get _postgenClassUrls() {
        return {`;

  var classFunctions = '';
  for (var i = item.length - 1; i >= 0; i--)
  {
    if (!item[i].item)
    {
      try {
        getPathObject += `${setMethodName(item[i].name).toLowerCase()}:'${item[i].request.url.path.join('/')}',`
        //console.log(item[i])

        classFunctions += `
            ${getDocs(item[i].name,item[i].request.description ? item[i].request.description.content : '', item[i].request.url, item[i].request.body, item[i].request.header || [])}
            static async ${setMethodName(item[i].name)}(${getVars(item[i].request.url, item[i].request.body, item[i].request.header || [])}) {
                var options = ${convertToOptions(item[i].request)};
                if(defaultOpts) {
                  options = Object.assign(options, defaultOpts);
                }
                if(opts) {
                  options = Object.assign(options, opts);
                }
                return await fasq.request(options)
            }
        `;
      } catch (e) {

      } 
    }
    else
    {
      classFunctions += `
        static get ${setClassName(item[i].name)}() {
          return ${setClassName( name != parentName ? name+'_'+item[i].name : item[i].name, parent)};
        }
      `
      newClasses.push(item[i]);
    }
  }
  js += getPathObject + `};
  }
  static getFunctionsPath(name) {
    return this._postgenClassUrls[name.toLowerCase()];
  }

  ${classFunctions}
  `;

  js += `}`

  for (var i = 0; i < newClasses.length; i++)
  {
    var parNam = parent && parent != parentName ? (parent.charAt(0).toUpperCase() + parent.slice(1))+'_'+(name.charAt(0).toUpperCase() + name.slice(1)) : name;
    js += genClass(newClasses[i].name, newClasses[i].item, '', newClasses[i],parNam);
  }

  return js;

}


jsFile += `
/**
  * SDK - importing the SDK for use
  * @param {string} host the hostname to the service (example: http://127.0.0.1)
  * @param {object} opts options that will be appened to every request. [Fasquest Lib Options](https://github.com/Phara0h/Fasquest) (example: {headers: {'API-KEY':'34098hodf'}})`
if(web) {
jsFile += `
  * @example
  * init
  * \`\`\`js
  * import sdk from './sdk.mjs';
  * const ${setClassName(collection.info.name)} = sdk('http://127.0.0.1');
  * \`\`\`
*/`
} else {
jsFile += `
  * @example
  * init
  * \`\`\`js
  * const { ${setClassName(collection.info.name)} } = require('./sdk.js')('http://127.0.0.1');
  * \`\`\`
*/`
}
jsFile +=`
function SDK (host, opts) {
  var hostUrl = '';
  var defaultOpts = null;

  if (host) {
    hostUrl = host;
  }
  if (opts) {
    defaultOpts = opts;
  }
  const fasq = new Fasquest();

`

jsFile += genClass(collection.info.name, collection.item, '', collection.info)

if(web) {
jsFile += `

    return {${allNewClasses.join()}};
  }
  export default SDK;
`
}
else {
jsFile += `

    return {${allNewClasses.join()}};
  }
  module.exports = SDK;
`
}

console.log(prettier.format(jsFile, {
  tabWidth: 2,
  singleQuote: true
}));
