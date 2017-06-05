'use strict';

angular.module('lenestApp', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                    },
                    'content': {
                        templateUrl : 'views/home.html'
//                        controller  : 'IndexController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
    
            // route for the test page
            .state('app.sample', {
                url:'sample',
                views: {
                    'content@': {
                        templateUrl : 'views/sample.html'
//                        controller  : 'ContactController'                  
                    }
                }
            })

            // route for the login page
            .state('app.login', {
                url:'login',
                views: {
                    'content@': {
                        templateUrl : 'views/login.html'
//                        controller  : 'ContactController'                  
                    }
                }
            })
    
            // route for form page
            .state('app.form', {
                url:'form',
                views: {
                    'content@': {
                        templateUrl : 'views/form.html'
//                        controller  : 'ContactController'                  
                    }
                }
            });
        
        
        // route to redirect to home in case URL not defined
        $urlRouterProvider.otherwise('/');
	
    })

    .directive("compareTo", function() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        };
    })
;
