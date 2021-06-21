import { Redirect } from 'react-router-dom' ;  
import axios from 'axios';

function SendOauthCode(props : any) {

    const code = new URLSearchParams(window.location.search).get("code");
    console.log("Start sending Oauth\nCode = ", code)
    axios.post("http://localhost:8080/authentication/oauth", {
        code: code,
        headers: {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin": "*",
            // "Referrer Policy": strict-origin-when-cross-origin 
        }
    })
    .then((v: any) => {
        console.log("res = ", v);
        return <Redirect to="/"/>;
    })
    .catch((e) => {
        console.log("res = ", e);
        return <Redirect to="/"/>;
    })
    return (<h1>Wait a moment</h1>);
}

export default SendOauthCode;