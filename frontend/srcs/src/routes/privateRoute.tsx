import { Redirect, Route } from "react-router-dom";

function PrivateRoute({ isAuth: logged, component: Component, exact, path} : {
    isAuth : boolean,
    component: any,
    exact?: boolean,
    path?: string
    }) : JSX.Element
    {
        return (
            <Route
                { ...exact }
                { ...path }
                render={ (props) => {
                    if (logged === false)
                        return <Redirect to="/" />
                    else
                        return <Component {... props} />;
                }}
            />
        );
    };
export default PrivateRoute;