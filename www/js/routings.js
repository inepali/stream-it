angular.module('StreamIT.routings', ['ionicUIRouter'])


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.add', {
    url: '/add',
    views: {
      'menuContent': {
        templateUrl: 'templates/stream-add.html'
      }
    }
  })
  .state('app.edit', {
    url: '/edit',
    views: {
      'menuContent': {
        templateUrl: 'templates/stream-edit.html'
      }
    }
  })

    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html'
        }
      }
    })
  .state('app.help', {
      url: '/help',
      views: {
        'menuContent': {
          templateUrl: 'templates/help.html'
        }
      }
  })
      .state('app.local', {
          url: '/local',
          views: {
              'menuContent': {
                  templateUrl: 'templates/local.html'
              }
          }
      })
    .state('app.streams', {
      url: '/streams',
      views: {
        'menuContent': {
          templateUrl: 'templates/streams.html',

        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/streams');
});