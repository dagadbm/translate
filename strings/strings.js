/* global angular */
angular.module('trick.strings', ['ngRoute'])

  .config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/strings', {
        templateUrl: '/strings/strings.html',
        controller: 'StringsCtrl'
      })
    }
  ])

  .controller('StringsCtrl', function ($scope, $firebaseObject, $firebaseArray,
     $sce, $location, Db, Auth) {
    var ref = Db.child('i18n')
    $scope.strings = $firebaseArray(ref.child('translatable'))

    $scope.statuses = {}

    Auth.$onAuthStateChanged(function () {
      if ($scope.user) {
        var langRef = Db.child('translators/' + $scope.user.uid)
        $scope.lang = $firebaseObject(langRef)

        $scope.lang.$loaded().then(function () {
          var i18nRef = ref.child('translated').child($scope.lang.$value)
          $scope.i18n = $firebaseObject(i18nRef)
        })
      } else {
        $location.path('/')
      }
    })

    $scope.save = function (id) {
      $scope.i18n.$save()
        .then(function () {
          $scope.statuses[id] = 'saved'
        })
    }

    $scope.trustAsResourceUrl = $sce.trustAsResourceUrl
  })
