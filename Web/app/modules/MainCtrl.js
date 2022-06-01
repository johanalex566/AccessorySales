angular
    .module('pedaleaApp.MainController', [])
    .controller('MainController', MainController);

MainController.$inject = ['$scope', '$timeout', 'UserService', 'GeneralService'];

function MainController($scope, $timeout, UserService, GeneralService) {
    let ctrl = this;
    ctrl.title = 'Pedalea App'
    ctrl.aside = 'app/modules/home/home.html';

    angular.element(document).ready(function () {
        $("aside").show();
    });

}