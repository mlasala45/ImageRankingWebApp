import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ImageChoice from './ImageChoice/ImageChoice'
import { useEffect, useState, useRef } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import '../../util/LayoutUtil.css'
import PropTypes from 'prop-types';
import { DrawBitmapToCanvasCentered, GetDesiredBitmapForCanvas } from '../../util/BitmapUtil';

import img_red from './300px-Team_red.png'
import img_blu from './300px-Team_blu.png'

export default function RankingUI({ appInst }) {
    const leftImgRef = useRef(null)
    const rightImgRef = useRef(null)

    const [choices, setChoices] = useState({
        current: null,
        next: null,
        queue: []
    })
    let choicesQueueLocal = []

    const loadNextChoice = () => {
        const choice = choicesQueueLocal.shift()
        const newChoices = {
            current: choices.next,
            next: choice,
            queue: [...choicesQueueLocal]
        }
        setChoices(newChoices)
    }

    const enqueueChoice = (choice) => {
        choicesQueueLocal.push(choice)
    }

    const requestNewChoice = async () => {
        let response = await fetch("/backend/Choices/GetNextChoice")
        let json = await response.json()
        enqueueChoice(json)
    }

    const [animData, setAnimData] = useState({
        slideAway: false,
        fadeIn: false,
        leftImageChosen: false,
        reset: true
    })

    const resetAnim = () => {
        setAnimData({
            ...animData,
            slideAway: false,
            fadeIn: false,
            reset: true
        })
    }

    const onFadeInDone = () => {
        loadNextChoice();
        resetAnim();
    }

    const playAnim = (leftChosen) => {
        setAnimData({
            ...animData,
            leftImageChosen: leftChosen,
            slideAway: true,
            fadeIn: false,
            reset: false
        })

        setTimeout(() => {
            //Trigger fade-in
            setAnimData({
                ...animData,
                leftImageChosen: leftChosen,
                slideAway: true,
                fadeIn: true,
                reset: false
            })

            requestNewChoice()
        }, 200);
        setTimeout(onFadeInDone, 600);
    }

    const reportChoice = async (isLeft) => {
        const data = {
            leftKey: choices.current.leftKey,
            rightKey: choices.current.rightKey,
            compareCode: (isLeft ? 1 : -1)
        }
        await fetch("/backend/Choices/ReportChoice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
    }

    const onKeyDown = (event) => {
        if (event.key == "ArrowLeft") {
            event.preventDefault();

            playAnim(true)
            reportChoice(true)
        }

        if (event.key == "ArrowRight") {
            event.preventDefault();

            playAnim(false)
            reportChoice(false)
        }
    }

    const loadImageOptions = async () => {
        const leftCanvases = leftImgRef.current.getElementsByTagName('canvas')
        const rightCanvases = rightImgRef.current.getElementsByTagName('canvas')

        if(choices.current == null) {
            for(let i = 0; i < 3; i++) {
                await requestNewChoice()
                loadNextChoice()
            }
        }
        if (choicesQueueLocal.length < 1) await requestNewChoice()

        const getBitmap = (key) => appInst.state.bitmaps[appInst.state.activeDatasetKey][key];
        if (choices.current != null && choices.next != null) {
            DrawBitmapToCanvasCentered(getBitmap(choices.current.left), leftCanvases[0])
            DrawBitmapToCanvasCentered(getBitmap(choices.next.left), leftCanvases[1])
            DrawBitmapToCanvasCentered(getBitmap(choices.current.right), rightCanvases[0])
            DrawBitmapToCanvasCentered(getBitmap(choices.next.right), rightCanvases[1])
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);

        console.log("Component Reload!");
        choicesQueueLocal = choices.queue
        loadImageOptions();

        //Cleanup
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    });

    return (
        <div id='RankingUI' className='center'>
            <Box>
                <Stack direction="row" spacing={20}>
                    <ImageChoice label='Left Image' ref={leftImgRef} slide_dir={animData.leftImageChosen ? 'right' : 'up'} animData={animData} appInst={appInst} />
                    <ImageChoice label='Right Image' ref={rightImgRef} slide_dir={!animData.leftImageChosen ? 'left' : 'up'} animData={animData} appInst={appInst} />
                </Stack>
            </Box>
        </div>
    );
}

RankingUI.propTypes = {
    appInst: PropTypes.object
}