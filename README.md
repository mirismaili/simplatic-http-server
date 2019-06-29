<p dir="auto">
	<a href="https://npmjs.com/package/simplatic-http-server">
		<img alt="npm (scoped)" src="https://img.shields.io/npm/v/simplatic-http-server.svg">
	</a>
	<a href="https://david-dm.org/mirismaili/simplatic-http-server">
		<img src="https://david-dm.org/mirismaili/simplatic-http-server.svg" alt="Dependencies Status">
	</a>
	<a href="https://david-dm.org/mirismaili/simplatic-http-server?type=dev">
		<img src="https://david-dm.org/mirismaili/simplatic-http-server/dev-status.svg" alt="devDependencies Status">
	</a>
	<a href="https://snyk.io//test/github/mirismaili/text-wrapper?targetFile=package.json">
		<img src="https://snyk.io//test/github/mirismaili/text-wrapper/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io//test/github/mirismaili/text-wrapper?targetFile=package.json">
	</a>
	<a href="https://packagephobia.now.sh/result?p=simplatic-http-server">
		<img src="https://packagephobia.now.sh/badge?p=simplatic-http-server" alt="install size">
	</a>
	<br>
	<a href="https://circleci.com/gh/mirismaili/simplatic-http-server">
		<img src="https://circleci.com/gh/mirismaili/simplatic-http-server.svg?style=svg">
	</a>
	<a href='https://coveralls.io/github/mirismaili/simplatic-http-server?branch=master'>
		<img src='https://coveralls.io/repos/github/mirismaili/simplatic-http-server/badge.svg?branch=master' alt='Coverage Status' />
	</a>
	<br>
	<a href="http://commitizen.github.io/cz-cli/">
		<img alt="Commitizen friendly" src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg">
	</a>
	<a href="https://github.com/mirismaili/simplatic-http-server/fork">
		<img src="https://img.shields.io/github/forks/mirismaili/simplatic-http-server.svg?style=social" alt="GitHub forks">
	</a>
	<a href="https://github.com/mirismaili/simplatic-http-server">
		<img src="https://img.shields.io/github/stars/mirismaili/simplatic-http-server.svg?style=social" alt="GitHub stars">
	</a>
	<br>
	<a href="https://github.com/mirismaili/simplatic-http-server/blob/master/LICENSE">
		<img alt="GitHub" src="https://img.shields.io/github/license/mirismaili/simplatic-http-server.svg">
	</a>
</p>

**Simple Static Http Server**

A very light-weight and very simple static HTTP server based on [*node.js*'s built-in `http` module](https://nodejs.org/api/http.html) 

***

# Installation

```bash
npm install simplatic-http-server
```

# Usage

1. Get access to the main `class`:

	```js
	const StaticServer = require('simplatic-http-server').default
	```
	
	Or:

	```js
	import StaticServer from 'simplatic-http-server'
	```

2. Instantiate:

	```js
	const staticServer = new StaticServer(portNumber /*, servePath = process.cwd() */) 
	```
	
3. Listen to `portNumber`:

	```js
	await staticServer.listen(/* onListenCallback, onErrorCallback */)

	console.log(`The static server listening on ${portNumber} ...`)
	```
	
	Or:
	
	```js
	staticServer.listen().then(
		() => console.log(`The static server listening on ${portNumber} ...`), 
		err => console.error(err)
	)
	```
	
4. Get access to a file in `servePath`. E. g. type in your browser's address bar: `http://127.0.0.1/dir/index.html` *(Note: The path of `index.html` must be `` `${servePath}/dir/index.html` `` on your local machine).*

5. Turn it off when no more needed:

	```js
	await staticServer.shutdown(/* callback */)
	```
