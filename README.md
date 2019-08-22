# Postgen

A simple node script to convert postman collections to clean REST client libs for node.

## Install

```
npm install -g postgen
```

## How to use

* Export your collection from postman as a `v2.1` collection.
* `cd` into your projects root folder that you want to use the client with.
* Install `fasquest` as it is the only dependency of the generated client.
```
npm install --save fasquest
```
* Run postgen
```
postgen /path/to/postman/collection.js > YourApi.js
```
* View the examples on how to use your newly generated lib.

## Examples

### [Wasps with Bazookas](https://github.com/Phara0h/WaspsWithBazookas) Service

A postman collection of the service:
 <img src="https://i.imgur.com/SssAdP5.png" alt="https://www.npmjs.com/package/waspswithbazookas" data-canonical-src="https://i.imgur.com/SssAdP5.png" />

Generated a class structure:
```
WaspsWithBazookas
    |
    |___Hive
    |___Wasps
    |___Wasp
```

#### Example use of the generation.
```js

const WaspsWithBazookas = require('./WaspsWithBazookasAPI.js')(
  'https://127.0.0.1:4269' // the url to service with no trailing /
);

// Start loadtest for 1second
WWB.Hive.HivePoke({
  "t": "10",
  "c": "50",
  "d": "1",
  "target": "http://127.0.0.1:4269/hive/status"
}).then(response=>{
  console.log(response.body)
})

// Wait 2 seconds and show the report
setTimeout(async ()=>{
  console.log((await WWB.Hive.HiveStatusReport()).body)
},2000)

```


### [Travelling](https://github.com/abeai/travelling) Service

A postman collection of the service:
 <img src="https://i.imgur.com/2hD4oPU.png" alt="https://www.npmjs.com/package/waspswithbazookas" data-canonical-src="https://i.imgur.com/2hD4oPU.png" />

Generated a class structure:
```
Travelling
    |
    |___Auth
    |___Groups
    |___User
         |____Current
```

#### Example use of the generation.
```js

const Travelling = require('./TravellingAPI.js')(
  'https://127.0.0.1:6969' // the url to service with no trailing /
);

Travelling.Auth.login({
  "username":"test",
  "password":"password1234"
}).then(response=>{
  console.log(response.body)
})

```



## Further Development
The code to do the generation is just some hacky code busted out in a hour. I would love help cleaning it up and making it more feature rich.
