var express = require('express');
var Item = require('../services/items');
var router = express.Router();

router.get('/items', function(req, res) {
  Item.list(function(items) {
    res.json(items);
  }, function(err) {
    res.status(400).json(err);
  });
});

router.post('/items', function(req, res) {
  Item.save(req.body.name, function(item) {
    res.status(201).json(item);
  }, function(err) {
    res.status(400).json(err);
  });
});

router.put('/items/:id', function(req, res) {
  console.log('Updating id', req.params.id);
  Item.update(req.params.id, {name: req.body.name}, function(item) {
    res.status(200).json(item);
  }, function(err) {
    res.status(400).json(err);
  });
});

// previous examples used :id parameter to delete
// item is saved to db with only a name parameter
// how can i use the existing view
router.delete('/items/:id', function(req, res) {
  console.log("Deleting id", req.params.id);
  Item.remove(req.params.id, function(item) {
    res.status(200).json(item);
  }, function(err) {
    res.status(400).json(err);
  });
});

module.exports = router;
//console.log(module);