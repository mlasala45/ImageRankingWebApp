import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import React, { Component } from 'react';
import ImageList from '@mui/material/ImageList';
import ListItemButton from '@mui/material/ListItemButton';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import './SelectDatasetUI.css'
import PropTypes from 'prop-types';
import { DrawBitmapToCanvasCentered, GetDesiredBitmapForCanvas } from '../../util/BitmapUtil';

export default function SelectDatasetUI({ appInst }) {
    const [listData, setListData] = useState([])

    async function fetchData() {
        const response = await fetch("/backend/DatasetManagement/GetPersonalDatasetsList")
        let json = await response.json()
        setListData(json)
    }

    useEffect(() => {
        fetchData()
    }, [])

    function onClick_CreateNewDatabase() {
        appInst.setState({
            ...appInst.state,
            mode: 'createDataset'
        })
    }

    async function onClick_SelectDatabase(i) {
        const response = await fetch("/backend/DatasetManagement/SetActiveDataset?id=" + listData[i].uid, {
            method: "POST"
        })
        if (response.ok) {
            appInst.setState({
                ...appInst.state,
                mode: 'pairwiseChoices',
                activeDatasetName: listData[i].name
            })
        }
        else {
            console.log("Error setting active dataset.")
        }
    }

    function ListContents() {
        let elements = []
        function AddElement(title, subtitle) {
            let i = elements.length
            elements.push(
                <ListItemButton key={elements.length} sx={{ backgroundColor: '#dbdbdb' }} onClick={() => onClick_SelectDatabase(i)}>
                    <ListItemText
                        primary={title}
                        secondary={subtitle}
                    />
                </ListItemButton>
            )
        }
        for (const entry of listData) {
            const subtitleBaseStr = entry.isLocalToClient ? "Local Dataset" : "Online Dataset"
            AddElement(entry.name, `${subtitleBaseStr} (${entry.numImages} Images, ${0} Choices, ${0}% Ranked)`)
        }

        elements.push(
            <ListItemButton key={elements.length} sx={{ backgroundColor: '#dbdbdb', textAlign: 'center', height: 53 }} onClick={onClick_CreateNewDatabase}>
                <ListItemText
                    primary={"Create New Dataset"}
                />
            </ListItemButton>
        )

        return elements;
    }

    return (
        <React.Fragment>
            <h2 style={{ marginInlineStart: '45px' }}>Select Dataset</h2>
            <div className='center-45'>
                <Box sx={{
                    bgcolor: '#6f6f7d',
                    borderRadius: 2,
                    width: 520,
                    minHeight: 110,
                    height: 'fit-content',
                    padding: 3
                }} >
                    <List dense={true}>
                        {ListContents()}
                    </List>
            </Box>
        </div>
        </React.Fragment >
    );
}

SelectDatasetUI.propTypes = {
    appInst: PropTypes.object.isRequired,
};