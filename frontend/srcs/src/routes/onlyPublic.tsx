import { Redirect, Route } from "react-router-dom";

function OnlyPublicRoute({ isAuth: logged, component: Component, exact, path, setUser} : {
    isAuth : boolean,
    component: any,
    exact?: boolean,
    path?: string,
    setUser?: Function

    }) : JSX.Element
    {
        console.log("setUser = ", setUser);
        return (
            <Route
                { ...exact }
                { ...path }
                render={ (props) => {
                    if (logged === true)
                        return <Redirect to="/" />
                    else
                        return <Component {... props} setUser={setUser}/>;
                }}
            />
        );
    };
export default OnlyPublicRoute;