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

            .state('blank', {
                url:'/blank',
                views: {
                    'header': {
                        template:''
                    },
                    'content': {
                        templateUrl: 'views/blank.html'
                    },
                    'footer': {
                        template:''
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
            
            .state('app.pregnancy', {
                parent: 'app',
                url:'pregnancy',
                views: {
                    'content@': {
                        templateUrl : 'views/pregnancy.html',
                        controller  : 'eddController'                  
                    }
                }
            })

            // route for the login page
            .state('app.login', {
                url:'login',
                views: {
                    'content@': {
                        templateUrl : 'views/login.html',
                        controller  : 'chatController'                  
                    }
                }
            })

            .state('app.chat', {
                url:'chat',
                views: {
                    'content@': {
                        templateUrl : 'views/chat.html',
                        controller  : 'chatController'                  
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
            })
        
            .state('app.laparo', {
                url:'laparoscopy',
                views: {
                    'content@': {
                        templateUrl : 'views/laparoscopy.html',
                        controller  : 'laparoController'                  
                    }
                }
            })

            .state('app.baby', {
                url:'babypics',
                views: {
                    'content@': {
                        templateUrl : 'views/babypics.html',
                        controller  : 'babyController'                  
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

    .directive('dropzone', function() {
                return {
                    restrict: 'C',
                    link: function(scope, element, attrs) {

                        var config = {
                            url: 'http://localhost:8080/upload',
                            maxFilesize: 100,
                            paramName: "uploadfile",
                            maxThumbnailFilesize: 10,
                            parallelUploads: 1,
                            autoProcessQueue: false
                        };

                        var eventHandlers = {
                            'addedfile': function(file) {
                                scope.file = file;
                                if (this.files[1]!=null) {
                                    this.removeFile(this.files[0]);
                                }
                                scope.$apply(function() {
                                    scope.fileAdded = true;
                                });
                            },

                            'success': function (file, response) {
                            }

                        };

                        dropzone = new Dropzone(element[0], config);

                        angular.forEach(eventHandlers, function(handler, event) {
                            dropzone.on(event, handler);
                        });

                        scope.processDropzone = function() {
                            dropzone.processQueue();
                        };

                        scope.resetDropzone = function() {
                            dropzone.removeAllFiles();
                        }
                    }
                }
            })
;
