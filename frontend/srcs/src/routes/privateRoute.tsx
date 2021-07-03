import { Redirect, Route } from "react-router-dom";

function PrivateRoute(props : {
    isAuth : boolean,
    component?: any,
    exact?: boolean,
    path?: string,
    children: React.ReactNode | JSX.Element
    }) : JSX.Element
    {
        return (
            <Route
                { ...props.exact }
                { ...props.path }
                render={ () => {
                    if (props.isAuth === false)
                        return <Redirect to="/" />
                    else
                        return (
                        <div>
                            { props.children }
                        </div>);
                }}
            />
        );
    };
export default PrivateRoute;