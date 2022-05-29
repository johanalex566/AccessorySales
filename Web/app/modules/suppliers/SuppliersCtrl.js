agGrid.initialiseAgGridWithAngular1(angular);

angular
    .module('pedaleaApp.suppliersController', [])
    .controller('suppliersController', suppliersController);

suppliersController.$inject = ['$scope', 'UserService', '$rootScope', '$window', '$filter', '$timeout', '$location', 'GeneralService'];

function suppliersController($scope, UserService, $rootScope, $window, $filter, $timeout, $location, GeneralService) {
    let ctrl = this;
   
    angular.element(document).ready(function () {
        //Starts
    });
}
