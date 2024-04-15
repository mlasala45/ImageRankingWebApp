import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import React, { Component } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import clsx from 'clsx';

import "./RankPredictionsUI.css"
import BitmapCanvas from '../BitmapCanvas/BitmapCanvas';
import { GetBitmapFromActiveDataset } from '../../util/BitmapUtil';

/*const rows = [
    { id:0, imgLeft: "red.png", imgRight: "blu.png", choice: -1, user: "Local", timestamp: new Date() }
]*/

export default function RankPredictionsUI({ appInst }) {

    const renderCell_img = function (params) {
        let bitmap = null
        if(appInst.state.activeDatasetIsOnline) {
            bitmap = `backend/Images/GetImage?datasetKey=${appInst.state.activeDatasetKey}&imageKey=${params.value}`
        }
        else
        {
            bitmap = GetBitmapFromActiveDataset(appInst, params.value);
        }
        return (<BitmapCanvas bitmap={bitmap} name={params.value} width='100px' height='100px' />)
    }

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            width: 170,
            align: 'center',
        },
        {
            field: 'imageName',
            headerName: 'Image',
            width: 90,
            renderCell: renderCell_img,
            align: 'center',
            sortable: false,
            cellClassName: 'grid-cell gray'
        },
        {
            field: 'ranking',
            type: 'number',
            headerName: 'Ranking',
            headerAlign: 'center',
            //type: 'number',
            valueGetter: (params) => {
                return (params.value * 100).toFixed(1)
            },
            width: 110,
            align: 'center'
        },
        {
            field: 'certainty',
            headerName: 'Certainty',
            headerAlign: 'left',
            width: 110,
            type: 'number',
            valueGetter: (params) => {
                return Math.round(params.value * 100)
            },
            valueFormatter: (params) => {
                return `${params.value}%`;
            },
            align: 'center',
            cellClassName: (params) =>
                clsx('grid-cell', {
                    positive: params.value >= 85,
                    warning: params.value < 85 && params.value >= 70,
                    negative: params.value < 70,
                }),
        },
        {
            field: 'numRelatedChoices',
            headerName: "Num Choices",
            width: 100,
            type: 'number',
            align: 'center'
        }
    ];

    const [rows, setRows] = useState([])

    async function fetchData() {
        const response = await fetch("/backend/Ranking/GetDatasetRankings")
        let json = await response.json()

        let rowsData = json.rankings
        for (const index in rowsData) {
            const row = rowsData[index]
            row.name = row.imageName
        }
        setRows(json.rankings)
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {

    }, [rows])

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
                sorting: {
                    sortModel: [{ field: 'ranking', sort: 'desc' }]
                }
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{
                '& .grid-cell.negative': {
                    backgroundColor: '#ff9191',
                },
                '& .grid-cell.positive': {
                    backgroundColor: 'lightgreen',
                },
                '& .grid-cell.warning': {
                    backgroundColor: '#ffc287',
                },
                '& .grid-cell.gray': {
                    borderRight: '1px solid lightgray',
                    borderLeft: '1px solid lightgray',
                },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
                toolbar: {
                    csvOptions: {
                        fileName: `Rank Predictions - ${appInst.state.activeDatasetName} - ${new Date().toISOString()}`,
                        fields: ['imageName', 'ranking', 'certainty','numRelatedChoices']
                    }
                }
            }}
    />
    );
}

RankPredictionsUI.propTypes = {
    appInst: PropTypes.object
};