/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./config/db.js":
/*!**********************!*\
  !*** ./config/db.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = {\n  'url': 'http://192.168.43.237:8529',\n  'database': 'mahasiswa',\n  // Database user credentials to use\n  'username': 'root',\n  'password': 'root'\n};\n\n//# sourceURL=webpack:///./config/db.js?");

/***/ }),

/***/ "./server.js":
/*!*******************!*\
  !*** ./server.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var express = __webpack_require__(/*! express */ \"express\");\n\nvar path = __webpack_require__(/*! path */ \"path\");\n\nvar bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\n\nvar cors = __webpack_require__(/*! cors */ \"cors\");\n\nvar articleAPI = __webpack_require__(/*! ./src/resources/article */ \"./src/resources/article.js\");\n\nvar socket = __webpack_require__(/*! socket.io */ \"socket.io\");\n\nvar config = __webpack_require__(/*! ./config/db */ \"./config/db.js\"); // Instantiate express\n\n\nvar app = express();\napp.enable('trust proxy'); // Set public folder using built-in express.static middleware\n\napp.use(express[\"static\"]('public')); // Set body parser middleware\n\napp.use(bodyParser.json());\napp.use(cors()); // Initialize routes middleware\n\napp.use('/api/users', articleAPI); // Use express's default error handling middleware\n\napp.use(function (err, req, res, next) {\n  if (res.headersSent) return next(err);\n  res.status(400).json({\n    err: err\n  });\n}); // Start the server\n\nvar port = process.env.PORT || 3000;\nvar server = app.listen(port, function () {\n  console.log(\"Listening on port \".concat(port));\n}); // Set up socket.io\n\nvar io = socket(server);\nvar online = 0;\nio.on('connection', function (socket) {\n  online++;\n  console.log(\"Socket \".concat(socket.id, \" connected.\"));\n  console.log(\"Online: \".concat(online));\n  io.emit('visitor enters', online);\n  socket.on('add', function (data) {\n    return socket.broadcast.emit('add', data);\n  });\n  socket.on('update', function (data) {\n    return socket.broadcast.emit('update', data);\n  });\n  socket.on('delete', function (data) {\n    return socket.broadcast.emit('delete', data);\n  });\n  socket.on('disconnect', function () {\n    online--;\n    console.log(\"Socket \".concat(socket.id, \" disconnected.\"));\n    console.log(\"Online: \".concat(online));\n    io.emit('visitor exits', online);\n  });\n});\n\n//# sourceURL=webpack:///./server.js?");

/***/ }),

/***/ "./src/resources/article.js":
/*!**********************************!*\
  !*** ./src/resources/article.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Infobutton API\n * @author dassiorleando\n */\nvar express = __webpack_require__(/*! express */ \"express\"),\n    router = express.Router(),\n    ArticleService = __webpack_require__(/*! ../services/article */ \"./src/services/article.js\");\n\nvar redis = __webpack_require__(/*! redis */ \"redis\");\n\nvar client = redis.createClient();\n/* POST an article */\n\nrouter.post('/', function (req, res) {\n  var article = {\n    name: req.body.name,\n    email: req.body.email,\n    age: req.body.age,\n    gender: req.body.gender\n  }; // Explicit save\n\n  ArticleService.create(article).then(function (doc) {\n    console.log('Saved documents ' + doc._key);\n    client.del('user');\n    return res.status(200).json(doc);\n  })[\"catch\"](function (error) {\n    console.error('Error saving document', error);\n    return res.status(500).json(error);\n  });\n});\n/* Update an article by his key */\n\nrouter.put('/:id', function (req, res) {\n  var article = {\n    _key: req.params.id,\n    name: req.body.name,\n    email: req.body.email,\n    age: req.body.age,\n    gender: req.body.gender\n  }; // Explicit update\n\n  ArticleService.update(article).then(function (doc) {\n    console.log('Updated document ' + doc._key);\n    client.del('user');\n    return res.status(200).json(doc);\n  })[\"catch\"](function (error) {\n    console.error('Error updating document', error);\n    return res.status(500).json(error);\n  });\n});\n\nfunction cacheUser(req, res, next) {\n  var key = req.params.id;\n  client.get(key, function (err, data) {\n    if (err) throw err;\n\n    if (data != null) {\n      res.send(JSON.parse(data));\n    } else {\n      next();\n    }\n  });\n}\n/* GET an article by his key. */\n\n\nrouter.get('/:id', cacheUser, function (req, res) {\n  var id = req.params.id;\n  ArticleService.findByKey(id).then(function (doc) {\n    console.log(\"Get a document by key \\\"\".concat(req.params.id, \"\\\".\"), doc._key);\n    client.setex(doc._key, 3600, JSON.stringify(doc));\n    return res.send(JSON.stringify(doc));\n  })[\"catch\"](function (error) {\n    console.error('Error getting single document', error);\n    return res.status(500).json(error);\n  });\n});\n/**\n * GET all saved articles\n */\n\nfunction getArticle(req, res) {\n  ArticleService.findAll().then(function (response) {\n    console.log(\"Load all saved documents.\", response._result);\n    client.setex('user', 3600, JSON.stringify(response._result));\n    return res.send(JSON.stringify(response._result));\n  })[\"catch\"](function (error) {\n    console.error('Error getting documents', error);\n    return res.status(500).json(error);\n  });\n}\n\nfunction cacheAll(req, res, next) {\n  client.get('user', function (err, data) {\n    if (err) throw err;\n\n    if (data != null) {\n      res.send(JSON.parse(data));\n    } else {\n      next();\n    }\n  });\n}\n\nrouter.get('/', cacheAll, getArticle);\n/* DELETE: delete a article by key */\n\nrouter[\"delete\"]('/:articleKey', function (req, res) {\n  var articleKey = req.params.articleKey;\n  ArticleService.remove(articleKey).then(function (doc) {\n    if (doc.removed) console.log('Removed document' + doc);\n    return res.status(200).json(doc);\n  })[\"catch\"](function (error) {\n    console.error('Error removing document', error);\n    return res.status(500).json(error);\n  });\n});\nmodule.exports = router;\n\n//# sourceURL=webpack:///./src/resources/article.js?");

/***/ }),

/***/ "./src/services/article.js":
/*!*********************************!*\
  !*** ./src/services/article.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * ArticleService\n * @author dassiorleando\n */\nvar dbConfig = __webpack_require__(/*! ../../config/db */ \"./config/db.js\"),\n    arangojs = __webpack_require__(/*! arangojs */ \"arangojs\"),\n    DB = new arangojs.Database({\n  // Database connection\n  url: dbConfig.url\n}); // Database selection\n\n\nDB.useDatabase(dbConfig.database); // Speficy the database user\n\nDB.useBasicAuth(dbConfig.username, dbConfig.password); // Collection to manage: Article\n\nvar Article = DB.collection('article');\n\nexports.create = function (article) {\n  return Article.save(article);\n};\n\nexports.update = function (article) {\n  if (!article._key) return;\n  return Article.update(article._key, article);\n};\n\nexports.remove = function (key) {\n  if (!key) return;\n  return Article.removeByKeys([key]);\n};\n\nexports.findAll = function () {\n  return Article.all();\n};\n\nexports.findByKey = function (key) {\n  if (!key) return;\n  return Article.firstExample({\n    _key: key\n  });\n};\n\n//# sourceURL=webpack:///./src/services/article.js?");

/***/ }),

/***/ "arangojs":
/*!***************************!*\
  !*** external "arangojs" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"arangojs\");\n\n//# sourceURL=webpack:///external_%22arangojs%22?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "redis":
/*!************************!*\
  !*** external "redis" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"redis\");\n\n//# sourceURL=webpack:///external_%22redis%22?");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"socket.io\");\n\n//# sourceURL=webpack:///external_%22socket.io%22?");

/***/ })

/******/ });