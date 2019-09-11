#!/usr/bin/env node

const fs = require('fs') // needed to read JSON file from disk
const Collection = require('postman-collection').Collection;
const beautify = require('beautify');

// Load a collection to memory from a JSON file on disk (say, sample-collection.json)
var collection = new Collection(JSON.parse(fs.readFileSync(process.argv[2]).toString())).toJSON();
var allNewClasses = [];

var jsFile = `
const fasq = require('fasquest');
var hostUrl = '';
`
var parseHeader = function (header)
{
  var params = '';
  for (var i = 0; i < header.length; i++)
  {
    if (header[i].key == 'Content-Type' && header[i].value == 'application/json')
    {
      params += 'json:true'
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

var getVars = function (url, body)
{
  var vars = [...Array.from(url.variable.map(v => v.key)), ...Array.from(url.query.map(v => v.key))].join();

  return (body ? 'body' + (vars.length > 0 ? ',' : '') : '') + vars + (vars.length > 0 || body ? ',opts' : 'opts');
}
//
var convertToOptions = function (request)
{
  var options = `{
    method: '${request.method}', resolveWithFullResponse:true, simple: false, ${parseUrl(request.url)}, ${request.body ? 'body,' : ''} ${request.header ? parseHeader(request.header) + ',' : ''}
  }`;

  return options;
}


var setMethodName = function (n)
{
  var mn = '' + n
  return toCamel(mn.replace(/:/g, '').replace(/[ \/-]/g, '_').toLowerCase())
}

var setClassName = function (n)
{
  var cn = '' + n;
  var name = toCamel(cn.replace(/ /g, '_').toLowerCase());
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

var genClass = function (name, item, js)
{

  var classEnd = false;
  //allNewClasses.push(setClassName(name));
  var newClasses = [];
  js += `class ${setClassName(name)} {
    constructor() {
    }
    `
  for (var i = item.length - 1; i >= 0; i--)
  {

    if (!item[i].item)
    {
      js += `
          static async ${setMethodName(item[i].name)}(${getVars(item[i].request.url, !!item[i].request.body)}) {
              var options = ${convertToOptions(item[i].request)};
              if(opts) {
                options = Object.assign(options, opts);
              }
              return await fasq.request(options)
          }
      `;
    }
    else
    {
      if (!item[i].name)
      {
        console.log(item[i])
      }
      js += `
        static get ${setClassName(item[i].name)}() {
          return ${setClassName(item[i].name)};
        }
      `
      newClasses.push(item[i]);

    }
  }
  js += `}`

  for (var i = 0; i < newClasses.length; i++)
  {
    js += genClass(newClasses[i].name, newClasses[i].item, '');
  }

  return js;

}

jsFile += genClass(collection.info.name, collection.item, '')

jsFile += `
  module.exports= function(host){
    if(host) {
      hostUrl = host;
    }
    return ${setClassName(collection.info.name)};
  }
`
//allNewClasses.join()
console.log(beautify(jsFile,
{
  format: 'js'
}));
