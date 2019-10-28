const qs = require('querystring');
const url = require('url');
const client = {
  https: require('https'),
  http: require('http'),
};

const agent = {
  http: new client.http.Agent(
  {
    keepAlive: true
  }),
  https: new client.https.Agent(
  {
    keepAlive: true
  })
};

const REDIRECT_CODES = [301, 302, 303, 307];

class SimpleError extends Error
{
  constructor()
  {
    super(
      'Error happened due to simple constraint not being 2xx status code.')
    this.name = 'FR_Simple';
  }
}

class RequestError extends Error
{
  constructor(e)
  {
    super('Error happened reguarding a request: ' + e.message)
    this.name = 'FR_Simple';
  }
}

class Fasquest
{
  constructor()
  {}

  request(options, cb = null)
  {
    if (!cb)
    {
      return this.requestPromise(options);
    }
    else
    {
      this._request(options, (err, req, res) =>
      {
        const connection = res.info || res.connection;
        reject(
        {
          req,
          res,
          err
        });
      })
    }
  }

  requestPromise(options)
  {
    return new Promise((resolve, reject) =>
    {
      this._request(options, (req, res, err) =>
      {
        if (err)
        {
          reject(
          {
            req,
            res,
            err
          })
        }
        else
        {
          resolve(options.resolveWithFullResponse ? res : res.body);
        }
      });
    });
  }

  _request(ops, cb, count = 0)
  {
    var options =  this._setOptions({...ops});
    if (options.body && !options.headers['Content-Length'])
    {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(options.body));
    }
    var req = client[options.proto].request(options.uri, options, (res) =>
    {
      res.body = '';
      res.on('data', (chunk) =>
      {
        res.body += chunk;
      });
      res.on('end', () =>
      {
        // remove as causes circular references
        delete options.agent;

        if(REDIRECT_CODES.indexOf(res.statusCode) !== -1 && count < options.redirect_max)
        {
            options.uri = url.resolve(options.uri,res.headers.location);
            options.proto = options.uri.split(':')[0];
            return this._request(this._setOptions(options), cb, ++count);
        }
        else {
          if (res.headers['content-type'] && res.headers['content-type'].indexOf('json') > -1)
          {
            try
            {
              res.body = JSON.parse(res.body);
            }
            catch (e)
            {
              // do nothing 
            }
          }
          if (options.simple)
          {
            if (res.statusCode > 299 || res.statusCode < 200)
            {
              return cb(req, res, new SimpleError());
            }
          }

          return cb(req, res, null);
        }

      });
    });

    req.on('error', (e) =>
    {
      // remove as causes circular references
      delete options.agent;

      return cb(req, null, new RequestError(e))
    });

    if (options.body)
    {
      req.write(options.json ? JSON.stringify(options.body) : options.body);
    }

    req.end();
  }

  _setOptions(options)
  {
    options.proto = options.proto || options.uri.split(':')[0];

    options.simple = options.simple !== false;

    if (options.qs)
    {
      var escQS = qs.stringify(options.qs);

      if (escQS.length > 0)
      {
        options.uri += (options.uri.indexOf('?') > -1 ? '&' : '?') + escQS;
      }
    }

    options.agent = options.agent || agent[options.proto];

    if (!options.headers)
    {
      options.headers = {};
    }

    if (options.json)
    {
      options.headers['Content-Type'] = 'application/json';
    }
    else if (options.form)
    {
      options.body = qs.stringify(options.form);
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.headers['Content-Length'] = Buffer.byteLength(options.body);
    }
    if(options.authorization) {
      if(options.authorization.basic) {
        options.headers['Authorization'] = 'Basic '+Buffer.from(options.authorization.basic.client+':'+options.authorization.basic.secret, 'ascii').toString('base64');
      }
      else if(options.authorization.bearer) {
        options.headers['Authorization'] = 'Bearer '+options.authorization.bearer;
      }

      delete options.authorization;
    }


    if(!options.redirect_max)
    {
      options.redirect_max = 5;
    }

    return options;
  }
}
module.exports = new Fasquest();
