import React, { Component } from 'react'

import * as actions from '../../../store/actions/index'
import { connect } from 'react-redux'

import { Redirect } from 'react-router-dom'

class Logout extends Component {

    componentWillMount(){
        this.props.onLogout();
    }

    render() {
        return (
            <div>
                <Redirect to='/'/>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onLogout: () => dispatch(actions.logOut())
})

export default connect(null, mapDispatchToProps)(Logout)