/* global angular */
angular.module('trick.admin', ['ngRoute'])

  .config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/admin', {
        templateUrl: '/admin/admin.html',
        controller: 'AdminCtrl'
      })
    }
  ])

  .controller('AdminCtrl', function ($scope, $firebaseObject, $firebaseArray,
     $sce, $location, Db, Auth) {
    var ref = Db.child('i18n')
    $scope.trStrings = $firebaseArray(ref.child('translatable'))
    $scope.unTrStrings = $firebaseArray(ref.child('untranslatable'))

    var langsRef = Db.child('langs')
    $scope.enabledLangs = $firebaseObject(langsRef)

    Auth.$onAuthStateChanged(function () {
      if (!($scope.user && ($scope.user.uid === 'Kpz3afszjBR0qwZYUrKURRJx2cm2' || $scope.user.uid === 'g0G3A7FxieN333lZ2RKclkmv9Uw1'))) {
        $location.path('/')
      }
    })

    $scope.newEnabledLang = {}

    $scope.disableLang = function (id) {
      delete $scope.enabledLangs[id]
      $scope.enabledLangs.$save()
    }

    $scope.enableLang = function () {
      if (typeof $scope.newEnabledLang.id === 'undefined' || $scope.newEnabledLang.id.length !== 2) {
        $scope.statusLang = 'Not a valid IOS 639-1 language code'
        return
      }
      if (typeof $scope.newEnabledLang.name === 'undefined' || $scope.newEnabledLang.id.length < 1) {
        $scope.statusLang = 'Language name is not valid'
        return
      }
      $scope.enabledLangs[$scope.newEnabledLang.id] = $scope.newEnabledLang.name
      $scope.enableLangs.$save()
      $scope.newEnabledLang = {}
    }

    $scope.new = {values: []}

    $scope.addTranslatable = function (untranslatable) {
      if (typeof $scope.new.id === 'undefined' || $scope.new.id.length < 1) {
        $scope.status = 'Error, id must have a value'
        return
      }
      if (($scope.new.isArray && $scope.new.values.length < 1) || (!$scope.new.isArray && (typeof $scope.new.value === 'undefined' || $scope.new.value.length < 1))) {
        $scope.status = 'Error, value must have a value'
        return
      }
      var obj = {
        id: $scope.new.id
      }

      if ($scope.new.isArray) {
        obj.values = $scope.new.values
      } else {
        obj.value = $scope.new.value
      }

      if (typeof $scope.new.context !== 'undefined') {
        obj.context = $scope.new.context
      }

      if (untranslatable) {
        $scope.unTrStrings.$add(obj)
          .then(function () {
            $scope.status = 'saved'
            $scope.new = {values: []}
          })
      } else {
        $scope.trStrings.$add(obj)
          .then(function () {
            $scope.status = 'saved'
            $scope.new = {values: []}
          })
      }
    }

    $scope.addUntranslatable = function () {
      $scope.addTranslatable(true)
    }

    $scope.trustAsResourceUrl = $sce.trustAsResourceUrl
  })
