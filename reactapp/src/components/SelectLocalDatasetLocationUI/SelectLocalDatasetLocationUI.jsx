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
import './SelectLocalDatasetLocationUI.css'
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

export default function SelectLocalDatasetLocationUI({ registerBitmap, appInst }) {
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
            const bitmap = GetDesiredBitmapForCanvas(canvas, appInst, appInst.state.activeDatasetKey)
            DrawBitmapToCanvasCentered(bitmap, canvas)
        }
    }

    const onClick_SelectFolder = async () => {
        //Acquire and validate directory selection
        const dirHandle = await window.showDirectoryPicker();
        if (!dirHandle) {
            alert("No selection");
            return
        }

        let count = 0;
        let loadedBitmapsLocal = []
        //For each file in the directory...
        for await (const [k, v] of dirHandle.entries()) {
            //Skip it if it's not an image
            var extension = k.split('.').pop().toLowerCase();
            const valid_extensions = ["png", "jpg", "jpeg"]
            if (!valid_extensions.includes(extension)) continue;

            count++;
            const file = await v.getFile()
            let bitmap
            try {
                //Attempt to load the file contents as a bitmap
                bitmap = await createImageBitmap(file)
                //On success, register the bitmap to app-level storage
                registerBitmap(appInst, appInst.state.activeDatasetKey, bitmap, k)
            }
            catch (e) {
                //On failure, create a bitmap of the error image
                //NOTE: This wastes memory since we only need one copy of the error bitmap, but it's probably not worth fixing
                bitmap = await createImageBitmap(document.getElementById('img-err'))
            }
            //Save the bitmap to the component-level storage the ImageList uses (with its title).
            loadedBitmapsLocal.push({ img: bitmap, title: k })
        }

        setLoadedBitmaps(loadedBitmapsLocal) //Push the updated bitmap list to component state

        //Update the element that reports the number of images loaded
        const label = document.getElementById('loadingReportLabel')
        label.innerText = count + " Images Loaded"
        label.style.visibility = 'visible'
    }

    const onClick_Ok = async () => {
        //TODO: Associate the bitmaps with the active dataset
        
        appInst.setState({
            ...appInst.state,
            mode: 'pairwiseChoices'
        })
    }

    const BottomBar = () => {
        if (loadedBitmaps.length > 0) {
            return (
                <div style={{ height: 50 }}>
                    <Button variant="contained" sx={{ width: 100, float:'right', right:12 }}
                        onClick={onClick_Ok}>Ok</Button>
                </div>
        )
        }
    }

    useEffect(onLoad)

    //Invisible Img tag is to ensure img_err is loaded. Provides a reference for JS functions to fetch and write to canvases.
    return (
        <React.Fragment>
            <img id='img-err' src={img_err} style={{ display: 'none' }} />
            <h2 style={{ marginInlineStart: '45px' }}>Select Local Dataset Location</h2>
            <div className='center-45'>
                <h2 style={{ marginInlineStart: '45px', display:'inline' }}>Please specify the location of this dataset on your computer:</h2>
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

SelectLocalDatasetLocationUI.propTypes = {
    registerBitmap: PropTypes.func.isRequired,
    appInst: PropTypes.object.isRequired,
};