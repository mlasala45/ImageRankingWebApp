import React, { Component } from 'react';
import RankingUI from './components/RankingUI/RankingUI.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import DatasetCreationUI from './components/DatasetCreationUI/DatasetCreationUI.jsx';
import VerticalTabs from './components/AppMainLayout/AppMainLayout.jsx';
import SelectDatasetUI from './components/SelectDatasetUI/SelectDatasetUI.jsx';
import SelectLocalDatasetLocationUI from './components/SelectLocalDatasetLocationUI/SelectLocalDatasetLocationUI.jsx';

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
        this.populateWeatherData();
    }

    registerBitmap(appInst, datasetKey, bitmap, bitmapKey) {
        const allBitmaps = appInst.state.bitmaps
        if (!(datasetKey in allBitmaps)) allBitmaps[datasetKey] = {}
        allBitmaps[datasetKey][bitmapKey] = bitmap
        appInst.setState({ ...appInst.state })
    }

    static renderForecastsTable(forecasts) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.date}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
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
            <React.Fragment>
                <h1 style={{ marginInlineStart: '45px' }}>Image Ranker</h1>
                {contents}
            </React.Fragment>
        );
    }

    async populateWeatherData() {
        const response = await fetch('weatherforecast');
        const data = await response.json();
        this.setState({ forecasts: data, loading: false });
    }
}
