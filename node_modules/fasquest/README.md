# Fasquest
A fast node request model, works very similar to `request` module but way faster and no dependencies.

### Install
```
npm install fasquest
```

### Basic Example
```js
const fasquest = require('fasquest');

var options = {
  uri: 'http://127.0.0.1/',
  resolveWithFullResponse: true,
  json: true
}

fasquest.request(options).then(res=>{
  console.log('hey look I got a response')
})


```
