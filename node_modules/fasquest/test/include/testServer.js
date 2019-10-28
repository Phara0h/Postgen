
  var fastify = require('fastify')()

  fastify.post('/', function (req, reply)
  {
    var
    {
      raw,
      ...r
    } = req;

    reply.code(200).send(r);
  })

  fastify.get('/', function (req, reply)
  {

    var
    {
      raw,
      ...r
    } = req;
    console.log(r)
    reply.code(200).send(r);
  })

  fastify.get('/bench', function (req, reply)
  {

    reply.code(200).send();
  })

  fastify.get('/redirect', function (req, reply)
  {

    reply.redirect('https://google.com')
  })
  fastify.listen(1237)
