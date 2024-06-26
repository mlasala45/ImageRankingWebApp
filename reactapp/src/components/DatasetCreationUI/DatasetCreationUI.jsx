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
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
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
    const [loadedData, setLoadedData] = useState({
        bitmaps: [],
        blobs: []
    })
    const [tabValue, setTabValue] = useState("1");

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    function getDatabaseType() {
        if (tabValue == 1) return "Local"
        if (tabValue == 2) return "Online"
        throw new Error("Invalid tab value for dataset type")
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
            sx: {
                'backgroundColor': '#c1c1ca'
            }
        };
    }

    const onLoad = () => {
        const imageList = document.getElementById('image-list')
        const canvases = imageList.getElementsByTagName('canvas')

        //Modify DOM elements
        //For each canvas under the image list...
        for (const canvas of canvases) {
            //Determine the desired bitmap, then draw it to the canvas
            //We have to do it this way if we want to display runtime bitmaps in DOM (AFAIK)
            const bitmap = GetDesiredBitmapForCanvas(canvas, appInst, "new-dataset")
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
        let loadedBlobsLocal = []
        //For each file in the directory...
        for await (const [k, v] of dirHandle.entries()) {
            //Skip it if it's not an image
            var extension = k.split('.').pop().toLowerCase();
            const valid_extensions = ["png", "jpg", "jpeg"]
            if (!valid_extensions.includes(extension)) continue;

            count++;
            const file = await v.getFile()
            loadedBlobsLocal.push({ title: k, blob: file })
            let bitmap
            try {
                //Attempt to load the file contents as a bitmap
                bitmap = await createImageBitmap(file)
                //On success, register the bitmap to app-level storage
                registerBitmap(appInst, "new-dataset", bitmap, k)
            }
            catch (e) {
                //On failure, create a bitmap of the error image
                //NOTE: This wastes memory since we only need one copy of the error bitmap, but it's probably not worth fixing
                bitmap = await createImageBitmap(document.getElementById('img-err'))
            }
            //Save the bitmap to the component-level storage the ImageList uses (with its title).
            loadedBitmapsLocal.push({ img: bitmap, title: k })
        }

        setLoadedData({
            bitmaps: loadedBitmapsLocal,
            blobs: loadedBlobsLocal
        }) //Push the updated bitmap list to component state

        //Update the element that reports the number of images loaded
        const label = document.getElementById('loadingReportLabel')
        label.innerText = count + " Images Loaded"
        label.style.visibility = 'visible'
    }

    async function onDatasetCreationSuccess(name, datasetKey) {
        appInst.state.bitmaps[datasetKey] = appInst.state.bitmaps['new-dataset']
        appInst.state.bitmaps['new-dataset'] = null
        appInst.setState({
            ...appInst.state,
            mode: 'pairwiseChoices',
            activeDatasetName: name,
            activeDatasetKey: datasetKey
        })
    }

    async function onClick_Next_LocalDataset() {
        //Create a list of all the image filenames from the component memory
        let data = []
        for (const entry of loadedData.bitmaps) {
            data.push(entry.title)
        }
        //Compose request body
        data = {
            Name: document.getElementById("textfield-dataset-name").value,
            ImageNames: data
        }
        //Post the new dataset's information to the backend
        const response = await fetch("/backend/DatasetManagement/CreateLocalDataset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        //On success, switch the app into 'Choices' mode
        //On fail, do nothing
        //TODO: Display error on fail
        if (response.ok) {
            const json = await response.json()
            onDatasetCreationSuccess(name, json.datasetKey)
        }
    }

    async function onClick_Next_OnlineDataset() {
        const formData = new FormData()
        let i = 0;
        for (const entry of loadedData.blobs) {
            formData.append(`img${i++}`, entry.blob, entry.title);
        }
        const name = document.getElementById("textfield-dataset-name").value
        formData.append("DatasetName", name)

        fetch('/backend/DatasetManagement/CreateOnlineDataset', {
            method: 'POST',
            body: formData
        }).then(async response => {
            if (response.ok) {
                const json = await response.json()
                onDatasetCreationSuccess(name, json.datasetKey)
            } else {
                console.error('Failed to upload dataset');
            }
        })
    }

    const onClick_Next = async () => {
        switch (getDatabaseType()) {
            case "Local":
                console.log("Local Dataset")
                onClick_Next_LocalDataset();
                break;
            case "Online":
                console.log("Online Dataset")
                onClick_Next_OnlineDataset();
                break;
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onClick_Next();
    }

    const BottomBar = () => {
        if (loadedData.bitmaps.length > 0) {
            return (
                <form onSubmit={handleSubmit} style={{ height: 50 }}>
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
                        type="submit">Next</Button>
                </form>
        )
        }
    }

    useEffect(onLoad)

    //Invisible Img tag is to ensure img_err is loaded. Provides a reference for JS functions to fetch and write to canvases.
    return (
        <React.Fragment>
            <img id='img-err' src={img_err} style={{ display: 'none' }} />
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
                    <TabContext value={tabValue}>
                    <TabList onChange={handleChange} variant="fullWidth">
                        <Tab label="Local Dataset" value="1" {...a11yProps(0)} />
                            <Tab label="Online Dataset" value="2" {...a11yProps(1)} />
                    </TabList>
                        <TabPanel value="1">The dataset will use images on your local computer.</TabPanel>
                        <TabPanel value="2">The dataset will upload your images and store them on the remote server.</TabPanel>
                    </TabContext>
                    <Stack className='stack' spacing={2}>
                        {/*<h4>Select Local Folder</h4>*/}
                        <Button variant="contained" sx={{ width: 156 }}
                            onClick={onClick_SelectFolder}>Select Folder</Button>
                        {ImageListBody(loadedData.bitmaps)}
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