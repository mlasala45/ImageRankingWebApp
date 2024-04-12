import React, { Component } from 'react';
import RankingUI from './components/RankingUI/RankingUI.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import DatasetCreationUI from './components/DatasetCreationUI/DatasetCreationUI.jsx';
import VerticalTabs from './components/AppMainLayout/AppMainLayout.jsx';
import SelectDatasetUI from './components/SelectDatasetUI/SelectDatasetUI.jsx';
import SelectLocalDatasetLocationUI from './components/SelectLocalDatasetLocationUI/SelectLocalDatasetLocationUI.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './constants.jsx';

import './App.css'

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = {
            mode: 'selectDataset',
            bitmaps: {},
            activeDatasetName: 'N/A',
            activeDatasetKey: null
        };
    }

    componentDidMount() {
    }

    registerBitmap(appInst, datasetKey, bitmap, bitmapKey) {
        const allBitmaps = appInst.state.bitmaps
        if (!(datasetKey in allBitmaps)) allBitmaps[datasetKey] = {}
        allBitmaps[datasetKey][bitmapKey] = bitmap
        appInst.setState({ ...appInst.state })
    }

    render() {
        /*let contents = this.state.loading
            ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
            : App.renderForecastsTable(this.state.forecasts);*/

        let contents = null
        switch (this.state.mode) {
            case 'selectDataset':
                contents = <SelectDatasetUI appInst={this}/>
                break;
            case 'createDataset':
                contents = <DatasetCreationUI registerBitmap={this.registerBitmap} appInst={this} />
                break;
            case 'pairwiseChoices':
                contents = <VerticalTabs appInst={this} />
                break;
            case 'selectLocalDatasetLocation':
                contents = <SelectLocalDatasetLocationUI registerBitmap={this.registerBitmap} appInst={this} />
                break;
        }

        console.log("Main App Render")
        return (
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <React.Fragment>
                    <h1 style={{ marginInlineStart: '45px' }}>Image Ranker</h1>
                    <div className='google-login'>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            console.log(credentialResponse);
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        /></div>
                {contents}
                </React.Fragment>
            </GoogleOAuthProvider>
        );
    }
}
