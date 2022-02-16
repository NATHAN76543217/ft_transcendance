import { Redirect, Route } from "react-router-dom";

function PrivateRoute(props: {
  isAuth: boolean;
  component?: any;
  exact?: boolean;
  path?: string;
  children?: React.ReactNode | JSX.Element;
}): JSX.Element {
  // console.log("isAuthenticated:", props.isAuth);

  const shouldRender = props.isAuth;

    if (props.children == null)
      return (
        <Route
          exact={props.exact}
          path={props.path}
          component={shouldRender ? props.component : () => <Redirect to="/" /> }
        >
        </Route>
      );
    else
      return (
        <Route
          exact={props.exact}
          path={props.path}
          render={shouldRender ? undefined : () => <Redirect to="/" />}
        >
          {props.children}
        </Route>
      );
}
export default PrivateRoute;
