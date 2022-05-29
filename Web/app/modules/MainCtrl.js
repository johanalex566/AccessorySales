angular
    .module('pedaleaApp.MainController', [])
    .controller('MainController', MainController);

MainController.$inject = ['$scope', '$timeout', 'UserService', 'GeneralService'];

function MainController($scope, $timeout, UserService, GeneralService) {
    let ctrl = this;
    ctrl.title = 'Pedalea App'
    ctrl.aside = 'app/modules/home/home.html';
    $("aside").show();
    ctrl.products = [];
    ctrl.carrito = [];
    ctrl.purchases = [];
    ctrl.address = '';
    ctrl.identificationCard = '';

    ctrl.GetProduct = function (credentials) {
        let StoredObjectParams =
        {
            "StoredParams": [],
            "StoredProcedureName": "GetProduct"
        }

        GeneralService.executeAjax({
            url: `${UserService.ApiUrl}`,
            data: StoredObjectParams,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response !== null) {
                    ctrl.products = ctrl.transformRespond(response.value[0]);
                    if (ctrl.products.length > 0) {
                        toastr.success(`Productos cargados correctamente`);
                    } else {
                        toastr.warning(`Los productos no se cargaron correctamente`);
                    }
                }
            }
        });
    };

    ctrl.Shipment = function () {
        let objPurchase = [];
        if (ctrl.address == '' || ctrl.identificationCard == '') {
            toastr.warning(`Debe ingresar una dirección y cédula para la compra`);
            return;
        }

        ctrl.carrito.forEach(carrito => {
            objPurchase.push({ "IdProduct": carrito.Producto.IdProduct, "Quantity": carrito.Cantidad, "Price": carrito.Producto.Price });
        });

        let StoredObjectParams =
        {
            "StoredParams": [
                { "Name": "jsonPurchase ", "Value": JSON.stringify(objPurchase) },
                { "Name": "Address", "Value": ctrl.address },
                { "Name": "IdentificationCard ", "Value": ctrl.identificationCard }
            ],
            "StoredProcedureName": "SavePurchase"
        }

        GeneralService.executeAjax({
            url: `${UserService.ApiUrl}`,
            data: StoredObjectParams,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.exception == null) {
                    ctrl.response = response;
                    toastr.success("Compra guardada correctamente");
                    ctrl.carrito = [];
                }
            }
        });
    };

    ctrl.resizeGrid = function () {
        $timeout(function () {
            ctrl.Grid.api.sizeColumnsToFit();
        }, 400);
    };

    ctrl.columns = [
        {
            headerName: "Nombre",
            field: "Name",
            width: 110,
            cellStyle: { 'text-align': 'left' },
            sortable: true,
            resizable: true,
            editable: false,
            filter: true
        },
        {
            headerName: "Fecha de compra",
            field: "ShipmentDate",
            width: 120,
            cellStyle: { 'text-align': 'left' },
            sortable: true,
            resizable: true,
            editable: false,
            filter: true
        },
        {
            headerName: "Cantidad",
            field: "Quantity",
            width: 120,
            cellStyle: { 'text-align': 'left' },
            sortable: true,
            resizable: true,
            editable: false,
            filter: true,
            cellEditor: 'agRichSelectCellEditor',
        },
        {
            headerName: "Total compra",
            field: "totalPurchase",
            width: 120,
            cellStyle: { 'text-align': 'left' },
            sortable: true,
            resizable: true,
            filter: true,
            editable: false,
            cellEditor: 'agLargeTextCellEditor',
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
                return "<span title='actualizar' class='material-icons' ng-click='ctrl.modifiedPurchase($event, this.data)'>edit</span> <span style='margin-left: 15px;'  title='Eliminar' ng-click='ctrl.deletePurchase($event, this.data)' class='material-icons'>delete</span>"
            }
        }
    ];

    ctrl.deletePurchase = function (ev, data) {
        if (!window.confirm("Esta seguro de eliminar el pedido seleccionado?")) {
            return;
        }

        let StoredObjectParams =
        {
            "StoredParams":
                [
                    { "Name": "IdShipment", "Value": data.IdShipment.toString() },
                    { "Name": "IdentificationCard ", "Value": ctrl.identificationCardShipment }
                ],
            "StoredProcedureName": "DeleteShipment"
        }

        GeneralService.executeAjax({
            url: `${UserService.ApiUrl}`,
            data: StoredObjectParams,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response.exception == null) {
                    ctrl.response = response;
                    ctrl.getPurchases();
                    toastr.success("Pedido eliminado correctamente");
                }
            }
        });
    };

    ctrl.modifiedPurchase = function (ev, data) {
        let newQuantity = prompt("Ingrese la nueva cantidad de productos a comprar:", data.Quantity);
        if (newQuantity == null || newQuantity == "" || newQuantity == data.Quantity) {
            toastr.warning(`Debe ingresar un valor correcto y diferente al actual para realizar la modificación`);
            return;
        } else {
            let StoredObjectParams =
            {
                "StoredParams":
                    [
                        { "Name": "IdShipment", "Value": data.IdShipment.toString() },
                        { "Name": "IdentificationCard ", "Value": ctrl.identificationCardShipment },
                        { "Name": "Quantity", "Value": newQuantity },
                    ],
                "StoredProcedureName": "UpdateShipment"
            }

            GeneralService.executeAjax({
                url: `${UserService.ApiUrl}`,
                data: StoredObjectParams,
                dataType: 'json',
                contentType: 'application/json',
                success: function (response) {
                    if (response.exception == null) {
                        ctrl.response = response;
                        ctrl.getPurchases();
                        toastr.success("Pedido modificado correctamente");
                    }
                }
            });
        }
    };

    ctrl.getPurchases = function () {

        if (ctrl.identificationCardShipment == undefined || ctrl.identificationCardShipment == '') {
            toastr.warning(`Debe ingresar su cédula para la compra`);
            return;
        }

        let StoredObjectParams =
        {
            "StoredParams": [{ "Name": "IdentificationCard ", "Value": ctrl.identificationCardShipment }],
            "StoredProcedureName": "GetShipmentByClientId"
        }

        GeneralService.executeAjax({
            url: `${UserService.ApiUrl}`,
            data: StoredObjectParams,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                if (response !== null) {
                    ctrl.purchases = ctrl.transformRespond(response.value[0]);
                    if (ctrl.purchases.length > 0) {
                        toastr.success(`Pedidos cargados correctamente`);
                        ctrl.Grid.api.setRowData([]);
                        ctrl.PurchaseData = ctrl.transformRespond(response.value[0]);
                        ctrl.Grid.api.setRowData(ctrl.PurchaseData);
                        ctrl.resizeGrid();
                    } else {
                        toastr.warning(`El cliente no tiene pedidos asociados`);
                        ctrl.Grid.api.setRowData([]);
                    }
                }
            }
        });
    };

    ctrl.Grid = {
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
    };

    ctrl.Add = function (p) {
        var itemActual;
        for (var i = 0; i < ctrl.carrito.length; i++) {
            if (ctrl.carrito[i].Producto.IdProduct == p.IdProduct) {
                itemActual = ctrl.carrito[i];
            }
        }
        if (!itemActual) {
            ctrl.carrito.push({
                Producto: p,
                Cantidad: 1
            });
        } else {
            itemActual.Cantidad++;
        }
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

    angular.element(document).ready(function () {
        ctrl.GetProduct();
    });

}