import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import { GoogleLogin } from '@react-oauth/google';
import Box from '@mui/material/Box';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginSection({ appInst }) {
    async function onClick_signOut() {
        const response = await fetch("/backend/Users/SignOutPermanentUser")
        if (response.ok) {
            appInst.onSignOut()
        }
        else {
            console.log("Server failed to process sign-out request")
        }

        return false;
    }

    function GetUserFullName(appInst) {
        if (appInst.state.loginState.loginType == 'guest') return "Guest User";
        return appInst.state.loginState.name
    }

    async function onLoginSuccess(codeResponse) {
        const data = {
            code: codeResponse.code
        }
        const response = await fetch("/backend/Users/ProcessGoogleClientAuthCode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const json = await response.json();
        appInst.onLoginSuccess(json["userName"])
    }

    const login = useGoogleLogin({
        onSuccess: onLoginSuccess,
        flow: 'auth-code',
    });

    function onClick_login() {
        login();
        return false;
    }

    const isSignedIn = appInst.state.loginState.loginType != 'guest'

    return (
        <Stack spacing={1} className='login-stack'>
            <Box sx={{
                bgcolor: '#6f6f7d',
                borderRadius: 2,
                height: 'fit-content',
                padding: 1
            }} >
                <Stack className='login-section' direction="row" spacing={2}>
                    <p style={{ color: 'black' }}>Signed in as {GetUserFullName(appInst)}</p>
                    {isSignedIn && <a href='#' onClick={onClick_signOut} style={{ color: '#9d9d9d' }}>Sign Out</a>}
                </Stack>
            </Box>
            {!isSignedIn && <a href='#' onClick={onClick_login} style={{ color: '#9d9d9d' }}>Sign in with Google</a>}
        </Stack>
    );
}

LoginSection.propTypes = {
    appInst: PropTypes.object
};