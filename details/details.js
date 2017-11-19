/* global angular */
angular.module('trick.details', ['ngRoute'])

  .config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/details/:id0/:id1', {
        templateUrl: '/details/details.html',
        controller: 'DetailsCtrl'
      })
    }
  ])

  .controller('DetailsCtrl', function ($scope, $firebaseObject, $firebaseArray,
    $routeParams, $sce, $location, Db, Auth) {
    $scope.id0 = Number($routeParams.id0)
    $scope.id1 = Number($routeParams.id1)
    var ref = Db.child('tricks/' + $scope.id0 + '/subs')
    $scope.trick = $firebaseObject(ref.child($scope.id1))

    Auth.$onAuthStateChanged(function () {
      if ($scope.user) {
        var langRef = Db.child('translators/' + $scope.user.uid)
        $scope.lang = $firebaseObject(langRef)

        $scope.lang.$loaded().then(function () {
          var i18nRef = ref.child($scope.id1 + '/i18n/' + $scope.lang.$value)
          $scope.i18n = $firebaseObject(i18nRef)
        })
      } else {
        $location.path('/')
      }
    })

    $scope.save = function () {
      $scope.i18n.$save()
        .then(function () {
          $scope.status = 'saved'
        })
    }

    $scope.trick.$loaded()
      .then(function () {
        $scope.Subpage($scope.trick.name)
      })

    if ($scope.id1 === 0 && $scope.id0 !== 0) {
      var refPrev = Db.child('tricks/' + ($scope.id0 - 1) + '/subs')
      var prevArr = $firebaseArray(refPrev)
      prevArr.$loaded()
        .then(function (data) {
          $scope.prevMax = data.length - 1
        })
    }

    var maxArr = $firebaseArray(ref)
    maxArr.$loaded()
      .then(function (data) {
        $scope.thisMax = data.length - 1
      })

    var maxRef = Db.child('tricks')
    var maxPar = $firebaseArray(maxRef)
    maxPar.$loaded()
      .then(function (data) {
        $scope.levMax = data.length - 1
      })

    $scope.trick.$loaded()
      .then(function (data) {
        if (!data.name) {
          $scope.Error('404 - Trick Not Found')
          $location.path('/')
        }
      })
    $scope.trustAsResourceUrl = $sce.trustAsResourceUrl
  })
