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
import { DataGrid } from '@mui/x-data-grid';

import "./ChoiceHistoryUI.css"
import BitmapCanvas from '../BitmapCanvas/BitmapCanvas';
import { GetBitmapFromActiveDataset } from '../../util/BitmapUtil';

/*const rows = [
    { id:0, imgLeft: "red.png", imgRight: "blu.png", choice: -1, user: "Local", timestamp: new Date() }
]*/

export default function ChoiceHistoryUI({ appInst }) {
    const renderCell_img = function(params) {
        const bitmap = GetBitmapFromActiveDataset(appInst, params.value);
        return (<BitmapCanvas bitmap={bitmap} name={params.value} width='100px' height='100px' />)
    }

    const columns = [
        {
            field: 'imgLeft',
            headerName: 'Left Image',
            width: 100,
            renderCell: renderCell_img,
            align: 'center'
        },
        {
            field: 'choice',
            headerName: 'Choice',
            //type: 'number',
            valueGetter: (params) => {
                if (!params.value) {
                    return params.value;
                }
                if (params.value == -1) return ">"
                if (params.value == 1) return "<"
                return "="
            },
            cellClassName: 'table-cell-bold',
            width: 90,
            align: 'center'
        },
        {
            field: 'imgRight',
            headerName: 'Right Image',
            width: 100,
            renderCell: renderCell_img,
            align: 'center'
        },
        {
            field: 'user',
            headerName: 'User',
            //type: 'number',
            width: 110,
        },
        {
            field: 'timeStamp',
            headerName: 'Time Stamp',
            type: 'dateTime',
            width: 160,
            valueGetter: (rowData) => {
                return new Date(Date.parse(rowData.value)) //2024-03-20T13:18:34.2560009
            }
        },
    ];

    const [rows, setRows] = useState([])
    
    async function fetchData() {
        const response = await fetch("/backend/Choices/GetChoiceHistory")
        let json = await response.json()

        setRows(json.choices)
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
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
    />
    );
}

ChoiceHistoryUI.propTypes = {
    appInst: PropTypes.object
};