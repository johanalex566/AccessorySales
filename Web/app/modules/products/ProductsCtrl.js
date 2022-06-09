agGrid.initialiseAgGridWithAngular1(angular);

angular
    .module('pedaleaApp.productsController', [])
    .controller('productsController', productsController);

productsController.$inject = ['$scope', 'UserService', '$rootScope', '$window', '$filter', '$timeout', '$location', 'GeneralService'];

function productsController($scope, UserService, $rootScope, $window, $filter, $timeout, $location, GeneralService) {
    let ctrl = this;
    ctrl.productsData = [];
    ctrl.transformRespond = function (Data) {
        let Result = [];
        let Columns = Data.Columns;
        let Rows = Data.Rows;

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
        let newSite = { 'Name': 'productos' };
        $location.path('/generalIncome').search({ param: newSite });
    }

    ctrl.modifiedSite = function (ev, data) {
        let newSite = { 'Name': 'productos', 'data': data };
        $location.path('/generalIncome').search({ param: newSite });
    }

    ctrl.getProducts = function () {
        let StoredObjectParams =
        {
            "StoredParams": [],
            "StoredProcedureName": "GetProducts"
        }

        GeneralService.executeAjax({
            url: `${UserService.ApiUrl}`,
            data: StoredObjectParams,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.exception == null) {
                    ctrl.productGrid.api.setRowData([]);
                    ctrl.productsData = ctrl.transformRespond(response.Value[0]);
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
            headerName: "Descripción",
            field: "Description",
            width: 130,
            cellStyle: { 'text-align': 'left' },
            sortable: true,
            resizable: true,
            editable: false,
            filter: true
        },
        {
            headerName: "Cantidad",
            field: "Stock",
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
        },
        {
            headerName: "Valor",
            field: "ProductValue",
            width: 120,
            cellStyle: { 'text-align': 'left' },
            sortable: true,
            resizable: true,
            filter: true,
            editable: false,
            tooltipField: "Ruta",
            cellEditor: 'agLargeTextCellEditor',
        },
        {
            headerName: "Fecha ingreso",
            field: "CreationDate",
            width: 120,
            cellStyle: { 'text-align': 'left' },
            sortable: true,
            resizable: true,
            filter: true,
            editable: false
        },
        {
            headerName: "Edición",
            field: "Options",
            width: 150,
            cellStyle: { 'text-align': 'left' },
            resizable: true,
            editable: false,
            sortable: false,
            suppressMenu: true,
            cellRenderer: function (params) {
                if (params.node.rowPinned) {
                    return '';
                }
                return "<span style='margin-left: 15px;'  title='Eliminar' ng-click='ctrl.delete($event, this.data)' class='material-icons'>delete</span>"
            }
        }
    ]

    ctrl.delete = function (ev, data) {
        if (!window.confirm("Esta seguro de eliminar el producto seleccionado?")) {
            return;
        }

        let StoredObjectParams =
        {
            "StoredParams": [
                { "Name": "ProductId", "Value": (data.Id)  }

            ],
            "StoredProcedureName": "DeleteProduct"
        };


        GeneralService.executeAjax({
            url: `${UserService.ApiUrl}`,
            data: StoredObjectParams,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.exception == null) {
                    toastr.success("Eliminado correctamente");
                    ctrl.getProducts();
                } else {
                    ctrl.messageLoginInvalid = 'No se encontraron datos';
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
        ctrl.getProducts();
    });
}
