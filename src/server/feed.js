var db = require('../db/db');
var config = require('../config');
var RSS = require('rss');
var _ = require('lodash');

var typeMap = {
  application: 'App',
  scope: 'Scope',
  webapp: 'Web App',
};

var snapTypeMap = {
  oem: 'OEM Snap',
  os: 'OS Snap',
  kernel: 'Kernel Snap',
  gadget: 'Gadget Snap',
  framework: 'Framework Snap',
  application: 'Snap',
};

function type(types) {
  var t = 'application';
  if (types.indexOf('application') > -1) {
    t = 'application';
  }
  else if (types.indexOf('webapp') > -1) {
    t = 'webapp';
  }
  else if (types.length > 0) {
    t = types[0];
  }

  var value = '';
  if (typeMap[t]) {
    value = typeMap[t];
  }

  return value;
}

function generateNewFeed(callback) {
  var feed = new RSS({
    title:       'uApp Explorer New Apps',
    description: 'New apps in uApp Explorer',
    feed_url:    config.server.host + '/api/rss/new-apps.xml',
    site_url:    config.server.host,
    image_url:   config.server.host + '/img/app-logo.png',
    ttl:         240 //4 hours
  });

  var query = db.Package.find();
  query.limit(10);
  query.sort('-published_date');
  query.exec(function(err, pkgs) {
    if (err) {
      callback(err);
    }
    else {
      _.forEach(pkgs, function(pkg) {
        feed.item({
          title:           'New ' + type(pkg.types) + ': ' + pkg.title,
          url:             config.server.host + '/app/' + pkg.name,
          description:     '<a href="' + config.server.host + '/app/' + pkg.name +
                           '"><img src="' + config.server.host + '/api/icon/' +
                           pkg.name + '.png" /></a><br/>' + pkg.description,
          author:          pkg.author,
          date:            pkg.last_updated,
          custom_elements: [{tagline: pkg.tagline}],
        });
      });

      callback(null, feed.xml({indent: true}));
    }
  });
}

function generateNewFeed2(callback) {
  var feed = new RSS({
    title:       'uApp Explorer New Apps',
    description: 'New apps in uApp Explorer',
    feed_url:    config.server.host + '/api/rss/new-apps2.xml',
    site_url:    config.server.host,
    image_url:   config.server.host + '/img/app-logo.png',
    ttl:         240 //4 hours
  });

  var query = db.Package.find();
  query.limit(10);
  query.sort('-published_date');
  query.exec(function(err, pkgs) {
    if (err) {
      callback(err);
    }
    else {
      _.forEach(pkgs, function(pkg) {
        feed.item({
          title:           'New ' + type(pkg.types) + ': ' + pkg.title + ' - ' + pkg.tagline,
          url:             config.server.host + '/app/' + pkg.name,
          description:     '<a href="' + config.server.host + '/app/' + pkg.name +
                           '"><img src="' + config.server.host + '/api/icon/' +
                           pkg.name + '.png" /></a><br/>' + pkg.description,
          author:          pkg.author,
          date:            pkg.last_updated,
          custom_elements: [{tagline: pkg.tagline}],
        });
      });

      callback(null, feed.xml({indent: true}));
    }
  });
}

function generateUpdatesFeed(callback) {
  var feed = new RSS({
    title:       'uApp Explorer Updated Apps',
    description: 'Updated apps in uApp Explorer',
    feed_url:    config.server.host + '/api/rss/updated-apps.xml',
    site_url:    config.server.host,
    image_url:   config.server.host + '/img/app-logo.png',
    ttl:         240 //4 hours
  });

  var query = db.Package.find();
  query.limit(10);
  query.sort('-last_updated');
  query.exec(function(err, pkgs) {
    if (err) {
      callback(err);
    }
    else {
      _.forEach(pkgs, function(pkg) {
        var changelog = pkg.changelog ? pkg.changelog : '';
        changelog = changelog.replace('\n', '<br/>');

        feed.item({
          title:           type(pkg.types) + ': ' + pkg.title + ' (v' + pkg.version + ')',
          url:             config.server.host + '/app/' + pkg.name,
          description:     '<a href="' + config.server.host + '/app/' + pkg.name +
                           '"><img src="' + config.server.host + '/api/icon/' +
                           pkg.name + '.png" /></a><br/><br/>Changelog:<br/>' +
                           changelog +
                           '<br/><br/>Description:<br/>' + pkg.description,
          author:          pkg.author,
          date:            pkg.last_updated,
          custom_elements: [{tagline: pkg.tagline}],
        });
      });

      callback(null, feed.xml({indent: true}));
    }
  });
}

function generateNewSnapFeed(callback) {
  var feed = new RSS({
    title:       'uApp Explorer New Snaps',
    description: 'New snaps in uApp Explorer',
    feed_url:    config.server.host + '/api/rss/new-snaps.xml',
    site_url:    config.server.host,
    image_url:   config.server.host + '/img/app-logo.png',
    ttl:         240 //4 hours
  });

  var query = db.Snap.find({});
  query.limit(10);
  query.sort('-published_date');
  query.exec(function(err, snaps) {
    if (err) {
      callback(err);
    }
    else {
      _.forEach(snaps, function(snap) {
        var description = snap.description ? '<br/>' + snap.description : '';

        feed.item({
          title:           'New ' + snapTypeMap[snap.type] + ': ' + snap.title,
          url:             config.server.host + '/app/' + snap.name,
          description:     '<a href="' + config.server.host + '/app/' + snap.name +
                           '"><img src="' + config.server.host + '/api/icon/' +
                           snap.name + '.png" /></a>' + description,
          author:          snap.author,
          date:            snap.last_updated,
          custom_elements: [{tagline: snap.tagline}],
        });
      });

      callback(null, feed.xml({indent: true}));
    }
  });
}

function setup(app, success, error) {
  app.get('/api/rss/new-apps.xml', function(req, res) {
    generateNewFeed(function(err, f) {
      if (err) {
        error(res, err);
      }
      else {
        res.header('Content-Type', 'text/xml');
        res.send(f);
      }
    });
  });

  app.get('/api/rss/new-apps2.xml', function(req, res) {
    generateNewFeed2(function(err, f) {
      if (err) {
        error(res, err);
      }
      else {
        res.header('Content-Type', 'text/xml');
        res.send(f);
      }
    });
  });

  app.get('/api/rss/updated-apps.xml', function(req, res) {
    generateUpdatesFeed(function(err, f) {
      if (err) {
        error(res, err);
      }
      else {
        res.header('Content-Type', 'text/xml');
        res.send(f);
      }
    });
  });

  app.get('/api/rss/new-snaps.xml', function(req, res) {
    generateNewSnapFeed(function(err, f) {
      if (err) {
        error(res, err);
      }
      else {
        res.header('Content-Type', 'text/xml');
        res.send(f);
      }
    });
  });
}

exports.setup = setup;
