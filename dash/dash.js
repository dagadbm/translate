/* global angular */
'use strict'
/**
 * @class trick.dash
 * @memberOf trick
 * @requires ngRoute
 */
angular.module('trick.dash', ['ngRoute'])

  .config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: '/dash/dash.html',
        controller: 'DashCtrl'
      })
    }
  ])

  .controller('DashCtrl', function ($scope, $firebaseArray, $firebaseObject,
    $anchorScroll, $location, Db, Auth) {
    $scope.Subpage(undefined)
    Auth.$onAuthStateChanged(function () {
      if ($scope.user) {
        var trickRef = Db.child('tricks')
        $scope.data = $firebaseArray(trickRef)
        var typeRef = Db.child('tricktypes')
        $scope.types = $firebaseObject(typeRef)
        $scope.typeifs = {}
        var langRef = Db.child('translators/' + $scope.user.uid)
        $scope.lang = $firebaseObject(langRef)
      }
    })

    var anchor = $location.hash()
    $anchorScroll.yOffset = 200
    setTimeout(function () {
      $anchorScroll()
    }, 100)

    $scope.class = function (id0, id1, i18n) {
      var x = ''
      x += (id0 + '' + id1 === anchor ? 'pop ' : '')
      if (i18n && i18n.name && i18n.description) {
        x += 'done'
      }
      return x
    }
  })
