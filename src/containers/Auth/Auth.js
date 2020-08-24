import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { Redirect } from "react-router-dom";

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner'

import classes from './Auth.css';
import * as actions from '../../store/actions/index';


const Auth = props => {
    
    const [isSignup, setIsSignup] = useState(true)

    const [authState, setAuthState] = useState(
        {
            controls: {
                email: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'email',
                        placeholder: 'Mail Address'
                    },
                    value: '',
                    validation: {
                        required: true,
                        isEmail: true
                    },
                    valid: false,
                    touched: false
                },
                password: {
                    elementType: 'input',
                    elementConfig: {
                        type: 'password',
                        placeholder: 'Password'
                    },
                    value: '',
                    validation: {
                        required: true,
                        minLength: 6
                    },
                    valid: false,
                    touched: false
                }
            },
        }
    )
    
    function checkValidity ( value, rules ) {
        let isValid = true;
        if ( !rules ) {
            return true;
        }

        if ( rules.required ) {
            isValid = value.trim() !== '' && isValid;
        }

        if ( rules.minLength ) {
            isValid = value.length >= rules.minLength && isValid
        }

        if ( rules.maxLength ) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if ( rules.isEmail ) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test( value ) && isValid
        }

        if ( rules.isNumeric ) {
            const pattern = /^\d+$/;
            isValid = pattern.test( value ) && isValid
        }

        return isValid;
    }

    const inputChangedHandler = ( event, controlName ) => {
        const updatedControls = {
            ...authState.controls,
            [controlName]: {
                ...authState.controls[controlName],
                value: event.target.value,
                valid: checkValidity( event.target.value, authState.controls[controlName].validation ),
                touched: true
            }
        };
        setAuthState({ controls: updatedControls })
    }

    const submitHandler = ( event ) => {
        event.preventDefault();
        props.onAuth( authState.controls.email.value, authState.controls.password.value, authState.isSignup );
    }

    const switchAuthModeHandler = () => {
        setIsSignup(!isSignup);
    }

    useEffect(() => {
        if(!props.buildingBurger && props.authRedirectPath !== '/') {
            props.onSetAuthRedirectPath()
        };
    }, [])
    
        const formElementsArray = [];
        for ( let key in authState.controls ) {
            formElementsArray.push( {
                id: key,
                config: authState.controls[key]
            } );
        }

        let form = formElementsArray.map( formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={( event ) => inputChangedHandler( event, formElement.id )} />
        ) );

        if(props.loading) form = <Spinner/>

        let errorMessage = null;

        if(props.error) errorMessage = <p>{props.error.message}</p>

        let autoRedirect = null;

        if(props.isAuthenticated) autoRedirect = <Redirect to={props.authRedirectPath}/>

        return (
            <div className={classes.Auth}>
                {autoRedirect}
                {errorMessage}
                 <form onSubmit={submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button 
                    clicked={switchAuthModeHandler}
                    btnType="Danger">SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        );
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onAuth: ( email, password, isSignup ) => dispatch( actions.auth( email, password, isSignup ) ),
        onSetAuthRedirectPath: () => dispatch(actions.authRedirectPath('/'))
    };
};

export default connect( mapStateToProps, mapDispatchToProps )( Auth );