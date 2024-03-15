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
import TextField from '@mui/material/TextField';
import img_err from './img_err.png'
import './DatasetCreationUI.css'
import PropTypes from 'prop-types';
import { DrawBitmapToCanvasCentered, GetDesiredBitmapForCanvas } from '../../util/BitmapUtil';


const ImageListBody = (loadedBitmaps) => {
    return (
        <div className='scrollRect'>
            <ImageList id='image-list' sx={{ width: '-webkit-fill-available', height: 'fit-content' }} cols={4}>
                {loadedBitmaps.map((item) => {
                    return (
                        <ImageListItem sx={{
                            aspectRatio: 1,
                            height: 0
                        }} key={item.title}>
                            <canvas id={"imagelist_canvas"} data-img-key={item.title} style={{ width: '100%' }} width="150" height="150" />
                            <ImageListItemBar
                                subtitle={item.title}
                            />
                        </ImageListItem>
                    );
                })}
            </ImageList>
        </div>)
}

export default function DatasetCreationUI({ registerBitmap, appInst }) {
    const [loadedBitmaps, setLoadedBitmaps] = useState([])

    const onLoad = () => {
        console.log("OnLoad")
        const imageList = document.getElementById('image-list')
        const canvases = imageList.getElementsByTagName('canvas')
        for (const canvas of canvases) {
            //const id = canvas.id;
            //const regex = /(\d+)/;
            //const match = id.match(regex);
            //const number = parseInt(match[0]);
            const bitmap = GetDesiredBitmapForCanvas(canvas, appInst)
            DrawBitmapToCanvasCentered(bitmap, canvas)
        }
    }

    const onClick_SelectFolder = async () => {
        const dirHandle = await window.showDirectoryPicker();
        if (!dirHandle) {
            alert("No selection");
            return
        }
        let count = 0;
        let loadedBitmapsLocal = []
        for await (const [k, v] of dirHandle.entries()) {
            count++;
            const file = await v.getFile()
            let bitmap
            try {
                bitmap = await createImageBitmap(file)
                registerBitmap(appInst, bitmap, k)
            }
            catch (e) {
                bitmap = await createImageBitmap(document.getElementById('img-err'))
            }
            loadedBitmapsLocal.push({ img: bitmap, title: k })
        }

        setLoadedBitmaps(loadedBitmapsLocal)
        const label = document.getElementById('loadingReportLabel')
        label.innerText = count + " Images Loaded"
        label.style.visibility = 'visible'
    }

    const onClick_Next = async () => {
        let data = []
        for (const entry of loadedBitmaps) {
            data.push(entry.title)
        }
        data = {
            Name: document.getElementById("textfield-dataset-name").value,
            ImageNames: data
        }
        const response = await fetch("/backend/CreateDataset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        if (response.ok) {
            appInst.setState({
                ...appInst.state,
                mode: 'pairwiseChoices',
                activeDatasetName: data.Name
            })
        }
    }

    const BottomBar = () => {
        if (loadedBitmaps.length > 0) {
            return (
                <div style={{ height: 50 }}>
                    <TextField id="textfield-dataset-name" label="Dataset Name" variant="outlined" required
                    InputProps={{
                        sx: { bgcolor: 'white', width:'inherit' },
                        }}
                        /*InputLabelProps={{
                            sx: { transform: 'translate(14px, 10px) scale(1);' }
                        }}*/
                        sx={{
                            left: 18,
                            width: 372,
                            height: '80%',
                            flexDirection: 'row'
                        }} />
                    <Button variant="contained" sx={{ width: 100, float:'right', right:12 }}
                        onClick={onClick_Next}>Next</Button>
                </div>
        )
        }
    }

    useEffect(onLoad)

    return (
        <React.Fragment>
            <img id='img-err' src={img_err} style={{ display: 'none' }} ></img>
            <h2 style={{ marginInlineStart: '45px' }}>Create Dataset</h2>
            <div className='center-45'>
                <Box sx={{
                    bgcolor: '#6f6f7d',
                    borderRadius: 2,
                    width: 520,
                    minHeight: 110,
                    height: 'fit-content',
                }} >
                    <p id='loadingReportLabel' className='loadingReportLabel' >67 Images Loaded</p>
                    <Stack className='stack' spacing={2}>
                        {/*<h4>Select Local Folder</h4>*/}
                        <Button variant="contained" sx={{ width: 156 }}
                            onClick={onClick_SelectFolder}>Select Folder</Button>
                        {ImageListBody(loadedBitmaps)}
                    </Stack>
                    {BottomBar()}
                </Box>
            </div>
        </React.Fragment>
    );
}

DatasetCreationUI.propTypes = {
    registerBitmap: PropTypes.func.isRequired,
    appInst: PropTypes.object.isRequired,
};