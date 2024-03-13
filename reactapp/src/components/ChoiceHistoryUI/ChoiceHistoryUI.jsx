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

const columns = [
    {
        field: 'imgLeft',
        headerName: 'Left Image',
        width: 150,
    },
    {
        field: 'imgRight',
        headerName: 'Right Image',
        width: 150,
    },
    {
        field: 'choice',
        headerName: 'Choice',
        //type: 'number',
        valueGetter: (params) => {
            if (!params.value) {
                return params.value;
            }
            if (params.value == -1) return "Left"
            if (params.value == 1) return "Right"
            return "Equal"
        },
        cellClassName: 'table-cell-bold',
        width: 110,
    },
    {
        field: 'user',
        headerName: 'User',
        //type: 'number',
        width: 110,
    },
    {
        field: 'timestamp',
        headerName: 'Time Stamp',
        type: 'dateTime',
        width: 160,
    },
];

const rows = [
    { id:0, imgLeft: "red.png", imgRight: "blu.png", choice: -1, user: "Local", timestamp: new Date() }
]

export default function ChoiceHistoryUI() {

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
};