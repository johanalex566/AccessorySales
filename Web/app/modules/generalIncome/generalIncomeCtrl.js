agGrid.initialiseAgGridWithAngular1(angular);
angular
    .module('pedaleaApp.generalIncomeController', [])
    .controller('generalIncomeController', generalIncomeController);

generalIncomeController.$inject = ['$scope', 'UserService', '$rootScope', '$window', '$filter', '$timeout', '$location', 'GeneralService'];

function generalIncomeController($scope, UserService, $rootScope, $window, $filter, $timeout, $location, GeneralService) {
    let ctrl = this;
    ctrl.nameSite = $location.$$search.param.Name;
    ctrl.title = `${ctrl.nameSite}`;

    ctrl.AddTime = function () {
        ctrl.newTimes.push(ctrl.defaultTime);
    }

    ctrl.transformRespond = function (Data) {
        let Result = [];
        let Columns = Data.columns;
        let Rows = Data.rows

        for (let i = 0; i < Rows.length; i++) {

            let Value = {}

            for (let j = 0; j < Columns.length; j++) {
                let ColumnName = Columns[j];
                Value[ColumnName] = Rows[i][j];
            }
            Result.push(Value);
        }
        return Result;
    };


    function isValidSaved() {
        if (ctrl.productName == null) {
            toastr.warning("Falta información por digitar, los campos marcados con * son  obligatorios");
            return false;
        }
        return true;
    }

    ctrl.saveProduct = function () {
        let obj = [];
        if (!isValidSaved()) {
            return;
        }

        obj = [
            {
                "productName": ctrl.productName
            }
        ];

        let StoredObjectParams =
        {
            "StoredParams": [
                { "Name": "jsonProduct", "Value": JSON.stringify(obj) }

            ],
            "StoredProcedureName": "SaveProduct"
        }

        GeneralService.executeAjax({
            url: `${UserService.ApiUrl}/Post`,
            data: StoredObjectParams,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.exception == null) {
                    ctrl.product = ctrl.transformRespond(response.value[0]);
                    ctrl.IdProduct = parseInt(ctrl.product[0].IdProduct);
                    toastr.success("Cambios guardados correctamente");
                }
            }
        });
    };

    ctrl.getSuppliers = function () {
        let StoredObjectParams =
        {
            "StoredParams": [],
            "StoredProcedureName": "GetSuppliers"
        }

        GeneralService.executeAjax({
            url: `${UserService.ApiUrl}/PostJWT`,
            data: StoredObjectParams,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.exception == null) {
                    ctrl.suppliers = ctrl.transformRespond(response.value[0]);
                }
            }
        });
    };

    ctrl.getProduct = function () {
        let StoredObjectParams =
        {
            "StoredParams": [{ "Name": "ProductId", "Value": "-1" }],
            "StoredProcedureName": "GetProduct"
        }

        GeneralService.executeAjax({
            url: `${UserService.ApiUrl}/PostJWT`,
            data: StoredObjectParams,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.exception == null) {
                    ctrl.produts = ctrl.transformRespond(response.value[0]);
                    fillLoadData(ctrl.produts[0]);
                }
            }
        });
    };

    function fillLoadData(modified) {

        if (ctrl.DefaultCode == null) {
            if ($location.$$search.param.Code == null || $location.$$search.param.Code == undefined) {
                $location.path('/home');
            }
        }

        if ($location.$$search.param != undefined) {
            modified = $location.$$search.param.data;
        }

        if (modified != undefined) {
            ctrl.productName = modified.productName;
        }

        if ($location.$$search.param != undefined) {
            if ($location.$$search.param.Code == 'SDM') {
                ctrl.showHeking = true;
            }
        }
    }

    angular.element(document).ready(function () {
        ctrl.getTowns();
        ctrl.getProduct();
    });
}
