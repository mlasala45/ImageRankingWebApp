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
import img_err from './img_err.png'
import './DatasetCreationUI.css'


const ImageListBody = (loadedBitmaps) => {
    return (
        <div className='scrollRect'>
            <ImageList id='image-list' sx={{ width: '-webkit-fill-available', height: 'fit-content' }} cols={4}>
                {loadedBitmaps.map((item, index) => {
                    return (
                        <ImageListItem sx={{
                            aspectRatio: 1,
                            height: 0
                        }} key={item.title}>
                            <canvas id={"imagelist_canvas_" + index} style={{ width: '100%' }} width="150" height="150">
                            </canvas>
                            <ImageListItemBar
                                subtitle={item.title}
                            />
                        </ImageListItem>
                    );
                })}
            </ImageList>
        </div>)
}

export default function DatasetCreationUI() {
    const [loadedBitmaps, setLoadedBitmaps] = useState([])

    const onLoad = () => {
        console.log("OnLoad")
        const imageList = document.getElementById('image-list')
        const canvases = imageList.getElementsByTagName('canvas')
        for (const canvas of canvases) {
            const id = canvas.id;
            const regex = /(\d+)/;
            const match = id.match(regex);
            const number = parseInt(match[0]);
            const img = loadedBitmaps[number].img;
            const ctx = canvas.getContext("2d");
            const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
            const destWidth = img.width * scaleFactor;
            const destHeight = img.height * scaleFactor;
            const x = (canvas.width - destWidth) / 2;
            const y = (canvas.height - destHeight) / 2;

            // Draw the scaled image on the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, x, y, destWidth, destHeight);
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

    }

    const NextButton = () => {
        if (loadedBitmaps.length > 0) {
            return (
                <div style={{height:50}}>
                <Button variant="contained" sx={{ width: 100, float:'right', right:12 }}
                        onClick={onClick_Next}>Next</Button></div>
        )
        }
    }

    useEffect(onLoad)

    return (
        <React.Fragment>
            <img id='img-err' src={img_err} style={{ display: 'none' }} ></img>
            <h2 style={{ marginInlineStart: '45px' }}>Create Dataset</h2>
            <div className='center'>
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
                    {NextButton()}
                </Box>
            </div>
        </React.Fragment>
    );
}