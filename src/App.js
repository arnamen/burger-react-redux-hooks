import React, { useEffect } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import { connect } from 'react-redux';
import { authCheckState } from './store/actions';
import AsyncComponent from './hoc/AsyncComponent/AsyncComponent'

const asyncCheckout = AsyncComponent(() => {
  return import('./containers/Checkout/Checkout')
})
const asyncOrders = AsyncComponent(() => {
  return import('./containers/Orders/Orders')
})
const asyncAuth = AsyncComponent(() => {
  return import('./containers/Auth/Auth')
})

const App = props => {

  useEffect(() => {
    props.onTryAutoSignup();
  }, [])

    let routes = ( props.isAuthenticated 
      ?   <Switch>
            <Route path="/checkout" component={asyncCheckout} />
            <Route path="/orders" component={asyncOrders} />
            <Route path="/logout" component={Logout} />
            <Route path="/auth" component={asyncAuth} />
            <Route path="/" exact component={BurgerBuilder} />
            <Redirect to='/'/>
          </Switch>
          : <Switch>
              <Route path="/auth" component={asyncAuth} />
              <Route path="/" exact component={BurgerBuilder} />
              <Redirect to='/'/>
            </Switch>
    )

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(authCheckState())
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
