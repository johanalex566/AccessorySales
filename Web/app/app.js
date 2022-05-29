agGrid.initialiseAgGridWithAngular1(angular);

angular
    .module('pedaleaApp', [
        'pedaleaApp.MainController',
        'pedaleaApp.productsController',
        'pedaleaApp.suppliersController',
        'pedaleaApp.generalIncomeController',
        'ngRoute',
        'angular-loading-bar',
        'agGrid'
    ])

    .factory('UserService', function () {
        return {
            ApiUrl: 'https://localhost:44379/api/AccessorySales'
        };
    })

    .config(function ($routeProvider, $qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
        $routeProvider
            .when('/home', {
                controller: "homeController",
                controllerAs: 'hc',
                templateUrl: 'app/modules/general/home/Home.html'
            })
            .when('/suppliers', {
                controller: "suppliersController",
                controllerAs: 'ctrl',
                templateUrl: 'app/modules/suppliers/Suppliers.html'
            })
            .when('/products', {
                controller: "productsController",
                controllerAs: 'ctrl',
                templateUrl: 'app/modules/products/products.html'
            })
            .when('/sales', {
                controller: "salesController",
                controllerAs: 'ctrl',
                templateUrl: 'app/modules/sales/sales.html'
            })
            .when('/generalIncome', {
                controller: "generalIncomeController",
                controllerAs: 'ctrl',
                templateUrl: 'app/modules/generalIncome/generalIncome.html'
            })
            .otherwise({
                redirectTo: '/'
            })
    });
