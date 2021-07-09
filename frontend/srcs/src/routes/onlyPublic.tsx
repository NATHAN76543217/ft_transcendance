import { Redirect, Route } from "react-router-dom";

function PrivateRoute(props: {
    isAuth: boolean,
    component?: any,
    exact?: boolean,
    path?: string,
    children?: React.ReactNode | JSX.Element
}): JSX.Element {
    return (
        <Route
            exact={props.exact}
            path={props.path}
            component={props.component}
            render={() => {
                if (props.isAuth === true)
                    return <Redirect to="/" />
                else
                    return <div>props.children</div>;
            }}
        />
    );
};
export default PrivateRoute;
