agGrid.initialiseAgGridWithAngular1(angular);

angular
    .module('pedaleaApp.suppliersController', [])
    .controller('suppliersController', suppliersController);

suppliersController.$inject = ['$scope', 'UserService', '$rootScope', '$window', '$filter', '$timeout', '$location', 'GeneralService'];

function suppliersController($scope, UserService, $rootScope, $window, $filter, $timeout, $location, GeneralService) {
    let ctrl = this;
    ctrl.productsData = [];
    ctrl.transformRespond = function (Data) {
        let Result = [];
        let Columns = Data.columns;
        let Rows = Data.rows;

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

    ctrl.resizeGrid = function () {
        $timeout(function () {
            ctrl.productGrid.api.sizeColumnsToFit();
        }, 400);
    }

    ctrl.addNewSite = function () {
        let newSite = { 'Name': 'proveedores' };
        $location.path('/generalIncome').search({ param: newSite });
    }

    ctrl.modifiedSite = function (ev, data) {
        let newSite = { 'Name': 'proveedores', 'data': data };
        $location.path('/generalIncome').search({ param: newSite });
    }

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
                    ctrl.productGrid.api.setRowData([]);
                    ctrl.productsData = ctrl.transformRespond(response.value[0]);
                    ctrl.productGrid.api.setRowData(ctrl.productsData);
                    ctrl.resizeGrid();
                } else {
                    ctrl.messageLoginInvalid = 'No se encontraron datos';
                }
            }
        });
    };

    window.onresize = function (event) {
        let offsetDivGrid = $("#divData").offset();
        let heightPage = $(document).height();
        document.getElementById("divData").style.height = (heightPage - offsetDivGrid.top - 15) + "px";
    }

    ctrl.columns = [
        {
            headerName: "Nombre",
            field: "Name",
            width: 150,
            cellStyle: { 'text-align': 'left' },
            sortable: true,
            resizable: true,
            editable: false,
            filter: true
        },
        {
            headerName: "Dirección",
            field: "Adress",
            width: 130,
            cellStyle: { 'text-align': 'left' },
            sortable: true,
            resizable: true,
            editable: false,
            filter: true
        },
        {
            headerName: "Telefono",
            field: "PhoneNumber",
            width: 120,
            cellStyle: { 'text-align': 'left' },
            sortable: true,
            resizable: true,
            editable: false,
            filter: true,
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: {
                cellHeight: 50,
                values: ['ARM', 'PRI', 'FLB'],
            },
        }
    ]

    ctrl.delete = function (ev, data) {
        if (!window.confirm("Esta seguro de eliminar el producto seleccionado?")) {
            return;
        }

        let StoredObjectParams =
        {
            "StoredParams":
                [
                    { "Name": "ProductId", "Value": data.ProductId.toString() },
                    { "Name": "Usuario", "Value": $window.localStorage.getItem('userName') }
                ],
            "StoredProcedureName": "DeleteProduct"
        }

        GeneralService.executeAjax({
            url: `${UserService.ApiUrl}/Post`,
            data: StoredObjectParams,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.exception == null) {
                    ctrl.response = response;
                    ctrl.getProducts();
                    ctrl.uploading = false;
                    toastr.success("Eliminado correctamente");
                } else {
                    ctrl.messageLoginInvalid = 'No se encontraron datos';
                    ctrl.uploading = false;
                }
            }
        });
    };

    ctrl.productGrid = {
        columnDefs: ctrl.columns,
        rowData: [],
        onGridReady: function (params) { },
        animateRows: true,
        rowSelection: 'multiple',
        defaultColDef: {
            editable: true,
        },
        stopEditingWhenGridLosesFocus: true,
        suppressRowClickSelection: true,
        angularCompileRows: true
    }

    angular.element(document).ready(function () {
        ctrl.getSuppliers();
    });
}
