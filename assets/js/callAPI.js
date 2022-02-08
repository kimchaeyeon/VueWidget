let baseUri = 'https://dev.communicationcloud.co.kr';
let csrfHeaderName;
let csrfToken;
let username;
let password;

export function get ( params )
{
    if(params.username) {
        console.log( params.username + '//' + params.password );
        username = params.username;
        password = params.password;
    }

    fetch( baseUri + params.uri , {
        headers: {
            Authorization: 'Basic ' + window.btoa( username + ':' +  password )
        },
        crossDomain: true,
        credentials: 'include',        
    })
    .then( function ( res ) {
        let data = res.json();
        if ( res.headers.get('X-CSRF-HEADER') && res.headers.get('X-CSRF-TOKEN') ) {
            csrfHeaderName = res.headers.get('X-CSRF-HEADER');
            csrfToken = res.headers.get('X-CSRF-TOKEN');
            console.log( `csrfHeaderName: ${csrfHeaderName}` );
            console.log( `csrfToken: ${csrfToken}` );
        }
        if ( params.callback ) {
            params.callback(data);
        }
    })
    .catch( function ( res ) {
        console.log( res );
        if ( params.error ) {
            params.error( res );
        }
    });


};


export function post ( params ){
    //let data = JSON.stringify( params.json, undefined, 2);
    fetch( baseUri + params.uri , {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type' : 'application/json'
        },
        crossDomain: true,
        credentials: 'include',
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
            params.error( err );
        }
    });
};



//////////////////////////////////////////////////////////////////////////////
// call setState
//////////////////////////////////////////////////////////////////////////////

let setAgentState = ( op ) => {
    post({
        uri: '/api/v2/me/channels/voice',
        json: { operationName : op },      
    });
};

export function ready() {
    setAgentState('Ready');
};

export function notReady() {
    setAgentState('NotReady');
};

export function afterCallWork() {
    setAgentState('AfterCallWork');
};


//////////////////////////////////////////////////////////////////////////////
// Call API
//////////////////////////////////////////////////////////////////////////////

let setOperation = ( id, op ) => {
    post({
        uri: `/api/v2/me/calls/${id}`,
        json: { operationName : op },
    });
};

export function dial( num, deviceId ) {
    post({
        uri: `/api/v2/me/devices/${deviceId}/calls`,
        json: {
                operationName: 'Dial',
                destination: {
                                phoneNumber: num
                            }
                }
    });
};

export function answer( id ) {
    setOperation( id, 'Answer' );
};

export function reject( id ) {
    setOperation( id, 'Reject' );
};

export function hangup( id ) {
    setOperation( id, 'Hangup' );
};

export function hold( id ) {
    setOperation( id, 'Hold' );
};

export function retrieve(id) {
    setOperation(id, 'Retrieve');
};


//////////////////////////////////////////////////////////////////////////////
// Conferences and transfers API
//////////////////////////////////////////////////////////////////////////////


export function OperationCall ( id, op, num )  {
    post({
        uri: `/api/v2/me/calls/${id}`,
        json: {
            operationName: op,
            destination: {
                            phoneNumber: num
                        }
            }

    });
};

export function singleStepTransfer( id, num ) {
    OperationCall( id, 'SingleStepTransfer', num );
};

export function singleStepConference( id, num ) {
    OperationCall( id, 'SingleStepConference', num );
};


//////////////////////////////////////////////////////////////////////////////
// Contacts API
//////////////////////////////////////////////////////////////////////////////

export function getAgentListFromGws(getAgentListCallback) {
    let includeUsersInBusinessUnits = 'AG_DEV';
    let filterParameters = '*';
    get({
        uri: `/api/v2/contacts?type=User&includeUsersInBusinessUnits=${includeUsersInBusinessUnits}&roles=ROLE_AGENT&limit=100&filterName=NamesOrPhoneNumberMatches&filterParameters=${filterParameters}&sortBy=name&order=Ascending`,
        includeCredentials: true,
        callback: getAgentListCallback,
    });
    return 
};
