import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ImageChoice from './ImageChoice/ImageChoice'
import { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import './RankingUI.css'

import img_red from './300px-Team_red.png'
import img_blu from './300px-Team_blu.png'

export default function RankingUI() {
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

    const playAnim = (leftChosen) => {
        setAnimData({
            ...animData,
            leftImageChosen: leftChosen,
            slideAway: true,
            fadeIn: false,
            reset: false
        })

        setTimeout(() => {
            setAnimData({
                ...animData,
                leftImageChosen: leftChosen,
                slideAway: true,
                fadeIn: true,
                reset: false
            })
        }, 200);
        setTimeout(resetAnim, 600);
    }

    const onKeyDown = (event) => {
        if (event.key == "ArrowLeft") {
            event.preventDefault();

            playAnim(true)
        }

        if (event.key == "ArrowRight") {
            event.preventDefault();

            playAnim(false)
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    });

    return (
        <div className='center'>
            <Box>
                <Stack direction="row" spacing={20}>
                    <ImageChoice label='Left Image' img_path={img_red} slide_dir={animData.leftImageChosen ? 'right' : 'up'} animData={animData} />
                    <ImageChoice label='Right Image' img_path={img_blu} slide_dir={!animData.leftImageChosen ? 'left' : 'up'} animData={animData} />
                </Stack>
            </Box>
        </div>
    );
}