'use strict';

angular.module('appstore').factory('api', function($q, $http) {
  var apps_cache = {};
  var apps_cache_limit = [];

  return {
    apps: function(paging, canceler) {
      paging = angular.copy(paging);
      var cache_key = JSON.stringify(paging);
      if (apps_cache_limit.indexOf(cache_key) > -1) {
        return $q.when(apps_cache[cache_key]);
      }
      else {
        _.forEach(paging.query, function(q) {
          if (_.isObject(q) && q._$in) {
            q.$in = q._$in;
            q._$in = undefined;
          }
        });

        var options = {
          params: paging
        };

        if (canceler) {
          options.timeout = canceler.promise;
        }

        var apps_deferred = $q.defer();
        $http.get('/api/apps', options).then(function(res) {
          var apps = _.sortBy(res.data.data, paging.sort);
          apps_deferred.resolve(apps);
        }, function(err) {
          apps_deferred.reject(err);
        });

        var count_deferred = $q.defer();
        $http.get('/api/apps?count=true', options).then(function(res) {
          var app_count = res.data.data;
          count_deferred.resolve(app_count);
        }, function(err) {
          count_deferred.reject(err);
        });

        return $q.all({
          'apps': apps_deferred.promise,
          'count': count_deferred.promise,
        }).then(function(data) {
          apps_cache[cache_key] = data;
          apps_cache_limit.push(cache_key);
          if (apps_cache_limit.length > 10) {
            var remove_key = apps_cache_limit.shift();
            delete apps_cache_limit[remove_key];
          }

          return data;
        });
      }
    },

    count: function(query) {
      var count_deferred = $q.defer();
      $http.get('/api/apps?count=true', {
        params: {
          query: query
        }
      }).then(function(res) {
        var app_count = res.data.data;
        count_deferred.resolve(app_count);
      }, function(err) {
        count_deferred.reject(err);
      });

      return count_deferred.promise;
    },

    categories: function() {
      var deferred = $q.defer();
      $http.get('/api/categories').then(function(res) {
        var categories = [{name: 'All Apps', internal_name: 'all'}];
        _.forEach(res.data.data, function(category) {
          categories.push(category);
        });

        deferred.resolve(categories);
      }, function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    },

    frameworks: function() {
      var deferred = $q.defer();
      $http.get('/api/frameworks').then(function(res) {
        var frameworks = ['All'];
        _.forEach(res.data.data, function(framework) {
          frameworks.push(framework);
        });

        deferred.resolve(frameworks);
      }, function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    },

    licenses: function() {
      var deferred = $q.defer();
      $http.get('/api/licenses').then(function(res) {
        var licenses = [
          {label: 'Open Source', value: 'open_source'},
          {label: 'Proprietary', value: 'proprietary'}
        ];

        _.forEach(res.data.data, function(license) {
          licenses.push({
            label: license,
            value: license.replace(/ /g, '_').replace(/\//g, '_').toLowerCase()
          });
        });

        deferred.resolve(licenses);
      }, function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    },

    app: function(name) {
      var deferred = $q.defer();
      $http.get('/api/apps/' + name).then(function(res) {
        var app = res.data.data;


        deferred.resolve(app);
      }, function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    },

    reviews: function(name, limit, skip) {
      var deferred = $q.defer();
      $http.get('/api/apps/reviews/' + name, {
        params: {
          limit: limit,
          skip: skip
        }
      }).then(function(res) {
        deferred.resolve(res.data.data);
      }, function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    },

    popular: function() {
      var deferred = $q.defer();
      $http.get('/api/apps/popular').then(function(res) {
        deferred.resolve(res.data.data);
      }, function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    },

    counts: function() {
      var deferred = $q.defer();
      $http.get('/api/apps/counts').then(function(res) {
        deferred.resolve(res.data.data);
      }, function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    },

    essentials: function() {
      var deferred = $q.defer();
      $http.get('/api/apps/essentials').then(function(res) {
        deferred.resolve(res.data.data);
      }, function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    },

    find: function(name) {
      var deferred = $q.defer();
      $http.get('/api/apps/find/' + name).then(function(res) {
        deferred.resolve(res.data.data);
      }, function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    },
  };
});