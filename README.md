# smartapi-parser

[![Build Status](https://travis-ci.com/kevinxin90/smartapi-parser.svg?branch=master)](https://travis-ci.com/kevinxin90/smartapi-parser)
[![Coverage Status](https://coveralls.io/repos/github/kevinxin90/smartapi-parser/badge.svg?branch=master)](https://coveralls.io/github/kevinxin90/smartapi-parser?branch=master)

A NodeJS library for parsing SmartAPI specifications

## Install

```
$ npm install smartapi-parser
```

## Usage
The package requires SmartAPI specification in JSON format as its input. You can use *fs* or API fetch libraries such as *node-fetch*, *axios* to load a SmartAPI file from local or remote desitiniations.
```js
const parser = require('smartapi-parser');
// need to install node-fetch libary first using npm i node-fetch
const fetch = require('node-fetch');

fetch('https://smart-api.info/api/metadata/81955d376a10505c1c69cd06dbda3047')
    .then(response => response.json())
    .then(spec => {
        let api = new parser(spec);
        console.log(api.metadata);
	});
	
	// // {
	// 	"title": "SEMMED Gene API",
	// 	"tags": ["disease", "annotation", "query", "translator", "biothings", "semmed"],
	// 	"url": "https://biothings.ncats.io/semmedgene",
	// 	"operations": [
	// 		"query_operation": ...,
	// 		"association": ...,
	// 		"response_mapping": ...,
	// 		"id": ...
	// 	]
	// // }
```



## Related

- [@biothings-explorer/smartapi-kg](https://github.com/kevinxin90/smartapi-kg.js) - Organize SmartAPI Specifications into a meta knowledge graph.