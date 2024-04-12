import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import { GoogleLogin } from '@react-oauth/google';
import Box from '@mui/material/Box';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginSection({ appInst }) {
    function onClick_signOut() {
        appInst.signOutLogin()
    }


    function GetUserFullName(appInst) {
        if (appInst.state.loginState.loginType == 'guest') return "Guest User";
        return appInst.state.loginState.name
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
            {!isSignedIn && <GoogleLogin
                onSuccess={credentialResponse => {
                    appInst.onLoginSuccess(credentialResponse.credential)
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />}
        </Stack>
    );
}

LoginSection.propTypes = {
    appInst: PropTypes.object
};