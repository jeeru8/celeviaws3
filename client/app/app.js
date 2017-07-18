var app = angular.module('celevi', ['ui.router', 'jcs-autoValidate', 'ngFileUpload', 'btford.socket-io', 'checklist-model', 'slickCarousel'])

app.run(function($rootScope, $http, $state, $location, authToken, user) {

    // toastr.options.positionClass = 'toast-bottom-center';
    toastr.options = {
            "positionClass": 'toast-bottom-center',
            "showDuration": "0",
            "hideDuration": "0",
            "timeOut": "1000",
            "extendedTimeOut": "0",
        };

    $rootScope.account = null;
	
	$rootScope.authentication = false;

    $rootScope.admin = false;
    
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {

        if (authToken.get() && $rootScope.account == null) {

            event.preventDefault();

            user.read().then(function (response) {

                $rootScope.account = response.data.user;

                $rootScope.authentication = true;

                if ($rootScope.account.role == "admin") {

                    $rootScope.admin = true;
                }

                $state.go(toState.name, toParams);

               // console.log(response);

            }).catch(function (response) {

                $rootScope.logout();

               // console.log(response);
                
            });
        }

        else if (authToken.get() && $rootScope.account) {

            if (toState.access.restricted && toState.access.role != "user" && toState.access.role != $rootScope.account.role) {
                        
                event.preventDefault();

                toastr.warning("Unauthorized access");

                $rootScope.logout();
            }
        }

        else if (!authToken.get()) {

            if (toState.access.restricted) {

                event.preventDefault();

                toastr.warning("You must login first to access this.");

                $rootScope.logout();
            }
        }

    });

    $rootScope.login = function (data) {

    	$rootScope.account = data.user;

        $rootScope.authentication = true;

        if ($rootScope.account.role == "admin") {

            $rootScope.admin = true; // dynamic viewing if admin
        }

		authToken.set(data.token);

		$state.go('landing');
    }

    $rootScope.logout = function () {

        $rootScope.account = null;

        $rootScope.authentication = false;

        $rootScope.admin = false;

		authToken.set();

        $state.go('landing');
    }

})

app.run(function (defaultErrorMessageResolver) {

    defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
        
        errorMessages["loading"] = 'Loading...';

        errorMessages["uniqueUsername"] = "Username already exists.";

        errorMessages["uniqueEmail"] = "Email already exists.";

        errorMessages["format"] = "Invalid Format"; 

        errorMessages["password"] = "Password should contain at least one uppercase, lowercase, number and at least 6 characters"; 

        errorMessages["compareTo"] = "Make sure the password is the same";     
   
    });

});