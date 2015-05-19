var Item = require('../models/item');

exports.save = function(name, callback, errback) {
  Item.create({name: name}, function(err, item) {
    if (err) {
      errback(err);
      return;
    }
    callback(item);
  });
};

exports.list = function(callback, errback) {
  Item.find(function(err, items) {
    if (err) {
      errback(err);
      return;
    }
    callback(items);
  });
};

exports.update = function(id, update, callback, errback) {
  Item.findByIdAndUpdate(id, update, function(err, item) {
    if (err) {
      errback(err);
      return;
    }
    callback(item);
  });
};

exports.remove = function(id, callback, errback) {
  Item.findByIdAndRemove(id, function(err, item) {
    if (err) {
      errback(err);
      return;
    }
    callback(item);
  });
};