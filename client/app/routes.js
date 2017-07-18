app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push('authInterceptor');

    $stateProvider.state('account', {
        url: '/account',
        templateUrl: 'app/components/account/account.html',
        controller: 'account',
        access: {restricted: true, role: "user"}
    })

    $stateProvider.state('account.messages', {
        url: '/messages',
        templateUrl: 'app/components/account/account-messages/account-messages.html',
        controller: 'account-messages',
        access: {restricted: true, role: "asset"}
    })

    $stateProvider.state('account.properties', {
        url: '/properties',
        templateUrl: 'app/components/account/account-properties/account-properties.html',
        controller: 'account-properties',
        access: {restricted: true, role: "asset"}
    })

    $stateProvider.state('account.update', {
        url: '/update',
        templateUrl: 'app/components/account/account-update/account-update.html',
        controller: 'account-update',
        access: {restricted: true, role: "user"}
    })

    $stateProvider.state('account.update-confirmation', {
        url: '/update/confirmation/:token',
        templateUrl: 'app/components/account/account-update-confirmation/account-update-confirmation.html',
        controller: 'account-update-confirmation',
        access: {restricted: false, role: "none"}
    })

    $stateProvider.state('account.update-image', {
        url: '/update/image',
        templateUrl: 'app/components/account/account-update-image/account-update-image.html',
        controller: 'account-update-image',
        access: {restricted: true, role: "user"}
    })

    $stateProvider.state('account.update-password', {
        url: '/update/password',
        templateUrl: 'app/components/account/account-update-password/account-update-password.html',
        controller: 'account-update-password',
        access: {restricted: true, role: "user"}
    })

    $stateProvider.state('ask', {
        url: '/ask',
        templateUrl: 'app/components/ask/ask.html',
        access: {restricted: true, role: "asset"}
    })

    $stateProvider.state('forgot-password', {
        url: '/forgot/password',
        templateUrl: 'app/components/forgot-password/forgot-password.html',
        controller: 'forgot-password',
        access: {restricted: false, role: "none"}
    })

    $stateProvider.state('landing', {
        url: '/landing',
        templateUrl: 'app/components/landing/landing.html',
        controller: 'landing',
        access: {restricted: false, role: "none"}
    })

    $stateProvider.state('properties', {
        url: '/properties/{category:json}',
        templateUrl: 'app/components/properties/properties.html',
        controller: 'properties',
        access: {restricted: false, role: "none"}
    })

    $stateProvider.state('property', {
        url: '/property/:id',
        templateUrl: 'app/components/property/property.html',
        controller: 'property',
        access: {restricted: false, role: "none"}
    })

    $stateProvider.state('property-create', {
        url: '/property-create',
        templateUrl: 'app/components/property-create/property-create.html',
        controller: 'property-create',
        access: {restricted: true, role: "asset"}
    })

    $stateProvider.state('property-update', {
        url: '/property-update/:id',
        templateUrl: 'app/components/property-update/property-update.html',
        controller: 'property-update',
        access: {restricted: true, role: "asset"}
    })

    $stateProvider.state('request', {
        url: '/request',
        templateUrl: 'app/components/request/request.html',
        access: {restricted: true, role: "asset"}
    })

     $stateProvider.state('reset-password', {
        url: '/reset/password/:token',
        templateUrl: 'app/components/reset-password/reset-password.html',
        controller: 'reset-password',
        access: {restricted: false, role: "none"}
    })

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'app/components/signup/signup.html',
        controller: 'signup',
        access: {restricted: false, role: "none"}
    })

    $stateProvider.state('users', {
        url: '/users',
        templateUrl: 'app/components/users/users.html',
        controller: 'users',
        access: {restricted: true, role: "admin"}
    })

    $urlRouterProvider.otherwise('/landing');
})
