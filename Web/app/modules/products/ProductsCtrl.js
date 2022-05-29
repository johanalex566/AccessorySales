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
        let newSite = { 'Name': 'Ingreso productos' };
        $location.path('/generalIncome').search({ param: newSite });
    }

    ctrl.modifiedSite = function (ev, data) {
        let newSite = { 'Name': 'Ingreso productos', 'data': data };
        $location.path('/generalIncome').search({ param: newSite });
    }

    ctrl.getProducts = function () {
        let StoredObjectParams =
        {
            "StoredParams": [],
            "StoredProcedureName": "GetProducts"
        }

        GeneralService.executeAjax({
            url: `${UserService.ApiUrl}/Post`,
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
            field: "name",
            width: 150,
            cellStyle: { 'text-align': 'left' },
            sortable: true,
            resizable: true,
            editable: false,
            filter: true
        },
        {
            headerName: "Descripción",
            field: "description",
            width: 130,
            cellStyle: { 'text-align': 'left' },
            sortable: true,
            resizable: true,
            editable: false,
            filter: true
        },
        {
            headerName: "Cantidad",
            field: "stock",
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
            field: "value",
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
            field: "dateCreated",
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
                return "<span title='actualizar' class='material-icons' ng-click='ctrl.modifiedSite($event, this.data)'>edit</span> <span style='margin-left: 15px;'  title='Eliminar' ng-click='ctrl.delete($event, this.data)' class='material-icons'>delete</span>"
            }
        }
    ]

    ctrl.delete = function (ev, data) {
        toastr.warning("Las imagenes e información asociada a este sitio turistico sera eliminada al precionar el botón ok");
        if (!window.confirm("Esta seguro de eliminar el sitio turistico seleccionado?")) {
            return;
        }

        let StoredObjectParams =
        {
            "StoredParams":
                [
                    { "Name": "IdSitioTuristico", "Value": data.IdSitioTuristico.toString() },
                    { "Name": "Usuario", "Value": $window.localStorage.getItem('userName') }
                ],
            "StoredProcedureName": "EliminarSitioTuristico"
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
                    toastr.success("Sitio eliminado correctamente");
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
        ctrl.getProducts();
    });
}
