/// <reference path="../typings/angularjs/angular.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>


(function () {

	angular.module('eventsApp', ['ngRoute', 'ngSanitize', 'ngCookies', 'ui.bootstrap']);

})();





(function () {
	
	// config() runs before run() , also ngRoute needs script referense and module[]
	var config = function ($routeProvider) {
		// $locationProvider.hashPrefix('!'); use to invite Google to crawl (replaces #! with ?escaped_fragment, back end takes it from there)
		$routeProvider
			.when('/allevents', {
				templateUrl: './views/allevents.html',
				controller: 'allEventsController',
				resolve: {															// This view will not be loaded until Ajax Call is done
					testResolve: ['eventDataFactory', function(eventDataFactory){	// In allEventsController we can get to the data by injecting 'testResolve' or use '$route.current.locals.testResolve'
						return eventDataFactory.getEvents();						// There is a data property on it. $scope.events = testResolve.data;
					}],																// If there is an error, the controller will never be instantiated and the view never loaded
					events: ['eventDataFactory', function(eventDataFactory){		// LETS FIX THAT, cant fix it, sorry
						return eventDataFactory.getEvents()
												.then(function(response){
													return response.data;
												}, function(response){
													return response.status;
												})
												.finally(function(){
													console.log("config route resolve finally");
												});
					}] 
				}
			})
			.when('/event/:id', {												// Accessible in eventController by $routeParams.id
				templateUrl: './views/event.html',
				controller: 'eventController'
			})
			.when('/newevent', {
				templateUrl: './views/newevent.html',
				controller: 'editEventController'
			})
			.when('/editprofile', {
				templateUrl: './views/editProfile.html',
				controller: 'editProfileController'
			})
			.when('/testthings/', {
				foo: 'bar',														// Accessible in testThingsController by $route.current.foo
				templateUrl: './views/testthings.html',							// Query string like ?name=henrik, is accessible in testThingsController with $route.current.params.name
				controller: 'testThingsController'								// $route.current.params.name will ALSO get access to route params (/page/:name), like 'kalle' in '/page/kalle'
			})																	// $route.current.pathParams.name will ONLY get access to route params (and not query string)
			.when('/testdirectives', {
				templateUrl: './views/testDirectives.html',
				controller: 'testDirectivesController'
			})
			.when('/inlinetemplate', {
				template: '<h2 style="color:red">Well hi there!</h2>'
			})
			.otherwise('/allevents');

	};

	angular.module('eventsApp').config(config);
	config.$inject = ['$routeProvider'];

})();
