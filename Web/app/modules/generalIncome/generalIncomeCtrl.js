agGrid.initialiseAgGridWithAngular1(angular);
angular
    .module('pedaleaApp.generalIncomeController', [])
    .controller('generalIncomeController', generalIncomeController);

generalIncomeController.$inject = ['$scope', 'UserService', '$rootScope', '$window', '$filter', '$timeout', '$location', 'GeneralService'];

function generalIncomeController($scope, UserService, $rootScope, $window, $filter, $timeout, $location, GeneralService) {
    let ctrl = this;
    ctrl.nameSite = $location.$$search.param.Name;
    ctrl.title = `Ingreso ${ctrl.nameSite}`;
    ctrl.suppliers = [];

    if (ctrl.nameSite == 'proveedores') {
        ctrl.ViewSuppliers = false;
        ctrl.ViewProducts = true;
    } else {
        ctrl.ViewSuppliers = true;
        ctrl.ViewProducts = false;
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



    ctrl.save = function () {
        let obj = [];
        let storeProcedure = "";

        if (ctrl.nameSite == 'proveedores') {
            storeProcedure = "SaveSuppliers";
            obj = [
                {
                    "Name": ctrl.supplierName,
                    "Adress": ctrl.adress,
                    "Phone": ctrl.phoneNumber,
                    "Email": ctrl.email,
                }
            ];
        }
        else {
            storeProcedure = "SaveProducts";
            obj = [
                {
                    "Name": ctrl.productName,
                    "Code": ctrl.productCode,
                    "Description": ctrl.productDescription,
                    "Stock": parseInt(ctrl.quantityStock),
                    "Value": parseFloat(ctrl.productValue),
                    "SupplierId": parseInt(ctrl.selectedsupplier)
                }
            ];
        };

        let StoredObjectParams =
        {
            "StoredParams": [
                { "Name": "json", "Value": JSON.stringify(obj) }

            ],
            "StoredProcedureName": storeProcedure
        };

        GeneralService.executeAjax({
            url: `${UserService.ApiUrl}`,
            data: StoredObjectParams,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.exception == null) {
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
            url: `${UserService.ApiUrl}`,
            data: StoredObjectParams,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.exception == null) {
                    ctrl.suppliers = ctrl.transformRespond(response.value[0]);
                } else {
                    ctrl.messageLoginInvalid = 'No se encontraron datos de proveedores';
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
        ctrl.getSuppliers();
    });
}
