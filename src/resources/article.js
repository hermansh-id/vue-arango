/**
 * Infobutton API
 * @author dassiorleando
 */

var express = require('express'),
  router = express.Router(),
  ArticleService = require('../services/article');

  const redis = require('redis');
  const client = redis.createClient();
  
/* POST an article */
router.post('/', function(req, res) {
  var article = {
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    gender: req.body.gender
  };

  // Explicit save
  ArticleService
  .create(article)
  .then(function(doc) {
    console.log('Saved documents ' +  doc._key);
    client.del('user');
    return res.status(200).json(doc);
  })
  .catch(function(error) {
    console.error('Error saving document', error);
    return res.status(500).json(error);
  });
});

/* Update an article by his key */
router.put('/:id', function(req, res) {
  var article = {
    _key: req.params.id,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    gender: req.body.gender
  };

  // Explicit update
  ArticleService
  .update(article)
  .then(function(doc) {
    console.log('Updated document ' +  doc._key);
    client.del('user');
    return res.status(200).json(doc);
  })
  .catch(function(error) {
    console.error('Error updating document', error);
    return res.status(500).json(error);
  });
});

function cacheUser(req, res, next) {
  
  const key = req.params.id;
  client.get(key, function (err, data) {
      if (err) throw err;

      if (data != null) {
          res.send(JSON.parse(data));
      } else {
          next();
      }
  });
}
/* GET an article by his key. */
router.get('/:id',cacheUser, function(req, res) {
  var id = req.params.id;

  ArticleService
  .findByKey(id)
  .then(function(doc) {
    console.log(`Get a document by key "${req.params.id}".`, doc._key);

    client.setex(doc._key, 3600, JSON.stringify(doc));

    return res.send(JSON.stringify(doc));
  })
  .catch(function(error) {
    console.error('Error getting single document', error);
    return res.status(500).json(error);
  });
});

/**
 * GET all saved articles
 */

function getArticle(req, res) {
  ArticleService
  .findAll()
  .then(function(response) {
    console.log(`Load all saved documents.`, response._result);

    client.setex('user', 3600, JSON.stringify(response._result));

    return res.send(JSON.stringify(response._result));
  })
  .catch(function(error) {
    console.error('Error getting documents', error);
    return res.status(500).json(error);
  });
}
function cacheAll(req, res, next) {
  client.get('user', function (err, data) {
      if (err) throw err;

      if (data != null) {
          res.send(JSON.parse(data));
      } else {
          next();
      }
  });
}
router.get('/',cacheAll, getArticle);

/* DELETE: delete a article by key */
router.delete('/:articleKey', function(req, res) {
  var articleKey = req.params.articleKey;

  ArticleService
  .remove(articleKey)
  .then(function(doc) {
    if (doc.removed) console.log('Removed document' + doc);

    return res.status(200).json(doc);
  })
  .catch(function(error) {
    console.error('Error removing document', error);
    return res.status(500).json(error);
  });
});

module.exports = router;
