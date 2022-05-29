angular.module("pedaleaApp")
    .factory('GeneralService', ['$http', '$rootScope', '$window', GeneralService]);
function GeneralService($http, $rootScope, $window) {
    var generalService = {};

    generalService.executeAjax = function (data) {
        var options = angular.extend({}, {
            'method': "POST",
            'url': data.url,
            'params': "",
            'data': data.data,
            'async': true,
            'success': function () { },
            'mapData': true,
            'dataType': data.dataType,
            'contentType': data.contentType
        }, data);
        $http({
            method: options.method,
            async: options.async,
            url: options.url,
            params: options.params,
            data: options.data,
            headers: {   'Content-Type': options.contentType },
            dataType: options.dataType,
        }).then(function (response) {
            if (typeof response === 'undefined' || (typeof response.data.Exception !== 'undefined' && response.data.Exception !== null)) {
                var errorMessage = typeof response === 'undefined' ? aLanguage.generalError : response.data.Exception.Message;
                generalService.showToastR({
                    body: errorMessage,
                    type: 'error'
                });
                return;
            }

            if (options.mapData && response.data.Value !== null) {
                var dataResponseMapped = [];
                $.each(response.data.Value, function (i, objValue) {
                    var objValueMapped = angular.copy(objValue);
                    objValueMapped.DataMapped = [];
                    var aColumns = objValue.Columns;
                    var aRows = objValue.Rows;
                    $.each(aRows, function (j, objRow) {
                        var objRowMapped = {};
                        $.each(aColumns, function (k, objColumn) {
                            objRowMapped[objColumn] = objRow[k];
                        });
                        objValueMapped.DataMapped.push(objRowMapped);
                    });
                    dataResponseMapped.push(objValueMapped);
                });
                if (typeof response.data.Value !== 'undefined')
                    response.data.Value = angular.copy(dataResponseMapped);
            }
            options.success(response.data);
        }).catch(function onError(response) {
            toastr.error(`Error ${response.data}`);
        });
    };

    return generalService;
}