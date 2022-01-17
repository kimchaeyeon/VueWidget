var baseUri = 'https://dev.communicationcloud.co.kr';
var csrfHeaderName;
var csrfToken;

$.ajaxSetup({
    beforeSend: function(xhr) {
        if (csrfHeaderName && csrfToken) {
            xhr.setRequestHeader(csrfHeaderName, csrfToken);
        }
    }
});

// $(document).ready(function() {
// });


//////////////////////////////////////////////////////////////////////////////
// HTTP Helpers
//////////////////////////////////////////////////////////////////////////////

export function get (params)
{
    console.log(params.username+"//"+params.password);
    console.log(params);
    var username =params.username;
    var password =params.password;
    var request = {
        url: baseUri + params.uri,
        type: 'GET',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data, textStatus, response) {
            console.log("response", response.getAllResponseHeaders());
            if (response.getResponseHeader('X-CSRF-HEADER') && response.getResponseHeader('X-CSRF-TOKEN')) {
                csrfHeaderName = response.getResponseHeader('X-CSRF-HEADER');
                csrfToken = response.getResponseHeader('X-CSRF-TOKEN');
                console.log('csrfHeaderName: ' + csrfHeaderName);
                console.log('csrfToken: ' + csrfToken);
            }
            if (params.callback) {
                params.callback(data);
            }
        },
        error: function (result) {
            console.log(result);
            if (params.error) {
                params.error(result);
            }
        }
    };
    if (params.includeCredentials) {
        request.beforeSend = function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(username + ':' + password));
        };
    }
    $.ajax(request);
};

export function post (params){
    var data = JSON.stringify(params.json, undefined, 2);
    var request = {
        url: baseUri + params.uri,
        type: 'POST',
        data: data,
        headers: {
        'Content-Type' : 'application/json'
        },
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        handleAs: 'json',
        success: function(data) {
            if (params.callback) {
                params.callback(data);
            }
        },
        error: function (req, err, exception) {
            console.log('Error! (' + req.status + ') : ' + err + ' ' + exception);
            if (params.error) {
                params.error(result);
            }
        }
    };
    $.ajax(request);
};


//////////////////////////////////////////////////////////////////////////////
// call setState
//////////////////////////////////////////////////////////////////////////////

var setState = function(operationName) {
    post({
        uri: "/api/v2/me/channels/voice",
        json: { "operationName": operationName}
        
    });
};

export function ready() {
    post({
        uri: '/api/v2/me',
        json: {
            operationName: 'Ready'
        },
        callback: function (params) {
            console.log(params)
        }
    });
};

export function notReady() {
    setState("NotReady");
};

export function afterCallWork() {
    setState("AfterCallWork");
};


//////////////////////////////////////////////////////////////////////////////
// Call API
//////////////////////////////////////////////////////////////////////////////

var setOperation = function (id,operationName) {
    post({
        uri: "/api/v2/me/calls/"+id,
        json: {"operationName": operationName}
    });
};

export function dial(number, deviceId) {
    post({
        uri: '/api/v2/me/devices/'+deviceId+'/calls',
        json: {
                "operationName": "Dial",
                "destination": {
                                "phoneNumber": number
                                }
                }
    });
};

export function answer(id) {
    setOperation(id,"Answer");
};

export function hangup(id) {
    setOperation(id,"Hangup");
};

export function hold(id) {
    setOperation(id,"Hold");
};

export function retrieve(id) {
    setOperation(id,"Retrieve");
};
