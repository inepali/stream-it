var app = angular.module('StreamIT.controllers', [])

app.controller('AppCtrl', function ($scope, $http, $rootScope, $timeout, $state, $cordovaMedia, $cordovaDevice, $cordovaToast, $ionicHistory,
  $ionicLoading, $localStorage, $location, $ionicNavBarDelegate, $ionicPlatform,  $cordovaFile, AdMob) {

  // start display ad after 3 minutes  
  $timeout(function () { $rootScope.showBanner(); }, 3000);

  $scope.init = function()
  {
    $scope.selectedIndex = null;
    $scope.stream = {};
  };

  $scope.enableDelete = function () {
    $scope.shouldShowDelete = true;
    $scope.showDeleteButton = false;
  };

  $scope.delete = function (idx) {
    $scope.streams.splice(idx, 1);
    $localStorage.streams = $scope.streams;
    $scope.cancelDelete();
  };

  $scope.deleteX = function () {
    $scope.streams.splice($scope.selectedIndex, 1);
    $localStorage.streams = $scope.streams;
    $state.go("app.streams");
  };

  $scope.save = function()
  {
    //$scope.streams[$scope.selectedIndex] = $scope.stream;
    //$localStorage.streams = $scope.streams;
    $scope.stream = {};
    $state.go("app.streams");
  };

  $scope.cancelDelete = function () {
    $scope.shouldShowDelete = false;
    $scope.showDeleteButton = true;
  };

  $scope.edit = function(idx)
  {
    $scope.selectedIndex = idx;
    $scope.stream = $scope.streams[idx];
    $state.go("app.edit");
  }


  // add new stream to the list
  $scope.addNewStream = function () {

    var previousStreams = $localStorage.streams || [];

    //$scope.stream.isPlaying = false;
    previousStreams.push($scope.stream);


    if ($scope.stream.iconUrl == null || $scope.stream.iconUrl == "") {
      $scope.stream.iconUrl = "img/icon.png";
    }

    //$cordovaToast.showLongCenter(JSON.stringify($scope.stream));

    $localStorage.streams = previousStreams;

    //$cordovaToast.showLongCenter('Stream was added!');

    $scope.stream = {};
    $state.go("app.streams");
  };

  $scope.loadLocals = function () {
      //TODO
  };
   


  // Loading existing stream data from localstorage
  $scope.loadStreams = function () {
    $scope.streams = $localStorage.streams || [];
    
    if ($scope.streams.length == 0) {

      var demoStreams = [{
        name: 'Kantipur FM',
        description: 'Live from Nepal',
        url: 'http://kantipur-stream.softnep.com:7248',
        iconUrl: 'http://d1i6vahw24eb07.cloudfront.net/s8654q.png'
      },
      {
        name: 'KDSM Gnd/Twr/App',
        description: 'KDSM Gnd/Twr/App',
        url: 'http://d.liveatc.net/kdsm',
        iconUrl: 'https://pbs.twimg.com/profile_images/1234883615/DSM_Avatar_2nd_option.jpg'
      },
      {
        name: 'Des Moines Weather',
        description: 'Live Audio',
        url: 'http://audioplayer.wunderground.com/nicknris/Des_Moines.mp3',
        iconUrl: 'https://pbs.twimg.com/profile_images/744978841672749056/vnRkc8Gp.jpg'
      }
      ];

      $localStorage.streams = demoStreams
      $scope.streams = demoStreams;

    }
   
    $scope.$broadcast('scroll.refreshComplete');
  };


  // Cordova Media Play functionalist
  $rootScope.stop = function () {
    if ($rootScope.media != null) {
      $rootScope.media.stop();
    }
    $rootScope.currentStream = null;
  };

//Media Play Stutus Callback
  var mediaStatusCallback = function (status) {

    //$cordovaToast.showLongCenter('status: ' + status);

    if (status == 1) {
      $ionicLoading.show({ template: 'Loading...' });

     // $cordovaToast.showLongCenter('audio started');
      $rootScope.currentStream.isPlaying = true;
      $ionicLoading.hide();
    } else if (status == 4) {
      $rootScope.currentStream.isPlaying = false;
      //$cordovaToast.showLongCenter('audio stopped at mediaStatusCallback');
    }

    else {
      //$cordovaToast.showLongCenter('status: ' + status);
      $ionicLoading.hide();
    }

  }

// Media Play 
  $rootScope.play = function (obj) {

    $timeout(function () { $rootScope.showInterstitial(); }, 10000);

    if ($rootScope.currentStream != null && $rootScope.currentStream.isPlaying != null && $rootScope.currentStream.isPlaying) {
      $rootScope.stop();
    }

    $rootScope.currentStream = obj;


    var iOSPlayingOptions = {
      numberOfLoops: 1,
      playAudioWhenScreenIsLocked: true
    };

    // the platform 
    var platform = $cordovaDevice.getPlatform();

    ///$cordovaToast.showLongCenter('platform: ' + platform);

    //$rootScope.media = $cordovaMedia.newMedia($rootScope.currentStream.url);
    $rootScope.media = new Media($rootScope.currentStream.url, null, null, mediaStatusCallback);
    //$rootScope.media = $cordovaMedia.newMedia(src);



    if (platform == 'iOS') {
      $rootScope.media.play(iOSPlayingOptions);
    } else {
      $rootScope.media.play();
    }

    $rootScope.currentStream.isPlaying = true;
    //$rootScope.showBanner();
  };

   //Banner Ad Implementation
  $rootScope.showBanner = function () {

     // $cordovaToast.showLongCenter('Show banner called!');
      var done = AdMob.showBanner();
      if (!done) {
          $ionicPopup.show({
              title: "AdMob is not ready",
              buttons: [
                  {
                      text: 'Got it!',
                      type: 'button-positive',
                      onTap: function (e) {
                      }
                  }
              ]
          })
      }
  };

  $rootScope.removeBanner = function () {
      AdMob.removeAds();
  };

  $rootScope.showInterstitial = function () {

      var done = AdMob.showInterstitial();
      if (!done) {
          $ionicPopup.show({
              title: "AdMob is not ready",
              buttons: [
                  {
                      text: 'Got it!',
                      type: 'button-positive',
                      onTap: function (e) {
                      }
                  }
              ]
          })
      }
  };

  $scope.selectedIndex = null;
  $scope.locals  = null;
  $scope.stream = {};
  $scope.shouldShowDelete = false;
  $scope.showDeleteButton = true;
});