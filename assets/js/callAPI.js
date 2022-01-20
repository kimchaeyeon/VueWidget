let baseUri = "https://dev.communicationcloud.co.kr";
let csrfHeaderName;
let csrfToken;


export function get ( params )
{
    console.log( params.username + "//" + params.password );
    let username = params.username;
    let password = params.password;

    fetch( baseUri + params.uri , {
        method: "GET",
        headers: {
            Authorization: "Basic " + window.btoa( username + ":" +  password )
        },
        crossDomain: true,
        credentials: "include",        
    })
    .then( function ( data ) {
        if ( data.headers.get("X-CSRF-HEADER") && data.headers.get("X-CSRF-TOKEN") ) {
            csrfHeaderName = data.headers.get("X-CSRF-HEADER");
            csrfToken = data.headers.get("X-CSRF-TOKEN");
            console.log( `csrfHeaderName: ${csrfHeaderName}` );
            console.log( `csrfToken: ${csrfToken}` );
        }
        if ( params.callback ) {
            params.callback(data);
        }
    })
    .catch( function ( data ) {
        console.log( data );
        if ( params.error ) {
            params.error( data );
        }
    });


};

export function post ( params ){
    //let data = JSON.stringify( params.json, undefined, 2);
    fetch( baseUri + params.uri , {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type" : "application/json"
        },
        crossDomain: true,
        credentials: "include",
        body: JSON.stringify( params.json, undefined, 2),
    })
    .then( function( res ) {
        res.json();
        if ( params.callback ) {
            params.callback( res );
        }
    })
    .catch( function (req, err, exception) {
        console.log( `Error! (${req.status}) : ${err} ${exception}` );
        if ( params.error ) {
            params.error( result );
        }
    });
};

//////////////////////////////////////////////////////////////////////////////
// call setState
//////////////////////////////////////////////////////////////////////////////

let setAgentState = function( op ) {
    post({
        uri: "/api/v2/me/channels/voice",
        json: { operationName : op },      
    });
};

export function ready() {
    setAgentState("Ready");
};

export function notReady() {
    setAgentState("NotReady");
};

export function afterCallWork() {
    setAgentState("AfterCallWork");
};


//////////////////////////////////////////////////////////////////////////////
// Call API
//////////////////////////////////////////////////////////////////////////////

let setOperation = function ( id, op ) {
    post({
        uri: `/api/v2/me/calls/${id}`,
        json: { operationName : op },
    });
};

export function dial( num, deviceId ) {
    post({
        uri: `/api/v2/me/devices/${deviceId}/calls`,
        json: {
                operationName: "Dial",
                destination: {
                                phoneNumber: num
                            }
                }
    });
};

export function answer( id ) {
    setOperation( id, "Answer" );
};

export function reject( id ) {
    setOperation( id, "Reject" );
};

export function hangup( id ) {
    setOperation( id, "Hangup" );
};

export function hold( id ) {
    setOperation( id, "Hold" );
};

export function retrieve(id) {
    setOperation(id, "Retrieve");
};


//////////////////////////////////////////////////////////////////////////////
// Conferences and transfers API
//////////////////////////////////////////////////////////////////////////////

let setOperation2 = function ( id, op, num ) {
    post({
        uri: `/api/v2/me/calls/${id}`,
        json: { operationName : op },
        destination : {
            phoneNumber: num
        },
    });
};

export function singleStepTransfer( id, num ) {
    setOperation2( id, "SingleStepTransfer", num );
};

export function singleStepConference( id, num ) {
    setOperation2( id, "singleStepConference", num );
};

//////////////////////////////////////////////////////////////////////////////
// Contacts API
//////////////////////////////////////////////////////////////////////////////

export function getAgentListFromGws() {
    let includeUsersInBusinessUnits = "AG_DEV";
    let filterParameters = "*"
    get({
        uri: `/api/v2/contacts?
        type=User
        &includeUsersInBusinessUnits=${includeUsersInBusinessUnits}
        &roles=ROLE_AGENT
        &limit=100
        &filterName=NamesOrPhoneNumberMatches
        &filterParameters=${filterParameters}
        &sortBy=name
        &order=Ascending`,
        includeCredentials: true,
        callback: callback,
    });
};
