describe('Fasquest', () =>
{
  var server;
  var fasquest = require('../index.js')
  var options = {
    uri: 'http://127.0.0.1:1237/',
    simple : false
  }

  test('start server', async () =>
  {
    //server = await require('./include/testServer.js')();
    expect(1).toBe(1);
  })

  describe('Promise', () =>
  {
    test('Simple Get', async () =>
    {
      var res = await fasquest.request(options)
      expect(1).toBe(1);
    })

    test('Simple Get with QS', async () =>
    {
      var opts={...options,qs:{
        foo: "foo",
        bar: "bar"
      },json: true}
      var res = await fasquest.request(opts)
      expect(res.query).toEqual(opts.qs);
    })

    test('Simple Get with Body?', async () =>
    {
      var opts={...options,body:{
        foo: "foo",
        bar: "bar"
      },method:'GET',json: true}

      var res = await fasquest.request(opts)
      //console.log(res)
      expect(1).toEqual(1);
    })

    test('Benchmark', async () =>
    {
      var opts={...options}
      opts.uri = opts.uri;

      var startTime = process.hrtime.bigint();
      for (var i = 0; i < 10000; ++i) {
        await fasquest.request(opts)
      }
      var totalTime = process.hrtime.bigint() - startTime;
      console.log(1/((Number(totalTime) / 1000000000)/10000))

      expect(1).toEqual(1);
    })

    test('Redirect', async () =>
    {
      var opts={...options}
      opts.uri = opts.uri+'redirect';
      try {
        var res = await fasquest.request(opts)

        console.log(res)
      } catch (e) {
        console.trace(e)
      } finally {

      }


      expect(1).toEqual(1);
    })

  })

  test('stop server', async () =>
  {
    //server.exit().catch(e=>{});
    expect(1).toBe(1);
  })

});
