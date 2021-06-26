import Button from "../../components/utilities/Button";

function Login()
{
    return (
        <div>
            <form>
            Login Form
            </form>
        {/* <Button content="Login with 42" url="https://localhost/api/authentication/oauth2/school42"/>
        <Button content="Login with google" url="https://localhost/api/authentication/oauth2/google"/> */}
        <Button content="Login with 42" url="http://localhost:8080/authentication/oauth2/school42"/>
        <Button content="Login with google" url="http://localhost:8080/authentication/oauth2/google"/>
        </div>
        );
}

export default Login ;