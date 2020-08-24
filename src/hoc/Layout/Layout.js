import React, { useState } from 'react';

import Auxillary from '../Auxillary/Auxillary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import { connect } from 'react-redux';

const Layout = props => {

    const [showSideDrawer, setShowSideDrawer] = useState(false)

    const sideDrawerClosedHandler = () => {
        setShowSideDrawer(false)
    }

    const sideDrawerToggleHandler = () => {
        setShowSideDrawer(!showSideDrawer)
    }

    return (
        <Auxillary>
            <Toolbar drawerToggleClicked={sideDrawerToggleHandler} isAuth={props.isAuthenticated} />
            <SideDrawer
                isAuth={props.isAuthenticated}
                open={showSideDrawer}
                closed={sideDrawerClosedHandler} />
            <main className={classes.Content}>
                {props.children}
            </main>
        </Auxillary>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.token !== null
})



export default connect(mapStateToProps, null)(Layout);