const checkStatus = ()=>{
    return undefined;
}
const parseJSON = ()=>{
    return undefined;
}

export function callApi(url, config, request, onRequestSuccess, onRequestFailure) {
    return dispatch => {
        dispatch(request);

        return fetch(url, config)
            .then(checkStatus)
            .then(parseJSON)
            .then((json) => {
                dispatch(onRequestSuccess(json));
            }).catch((error) => {
                const response = error.response;
                if (response === undefined) {
                    dispatch(onRequestFailure(error));
                } else {
                    parseJSON(response)
                        .then((json) => {
                            error.status = response.status;
                            error.statusText = response.statusText;
                            error.message = json.message;
                            dispatch(onRequestFailure(error));
                        });
                }
            });
    };
}
export function fetchUserCounter() {
    const url = `${API_ROOT}/userInformation`;
    return callApi(url, null, COUNTERRequest(), COUNTERSuccess(), COUNTERFailure());
}




