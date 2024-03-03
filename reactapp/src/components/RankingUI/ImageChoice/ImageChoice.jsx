import './ImageChoice.css'
import { ThemeProvider, createTheme } from '@mui/system';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import { forwardRef } from 'react';
import { useEffect, useRef } from 'react';
import { DrawBitmapToCanvasCentered, GetDesiredBitmapForCanvas } from '../../../util/BitmapUtil';


const ImageFrame = () => (
    <Box sx={{
        bgcolor: '#3f3f47',
        borderColor: 'black',
        border: 1,
        height: 1
    }}>
        <canvas style={{ width: '100%', height:'100%' }} width='300px' height='300px' />
    </Box>
);

const ImageChoice = forwardRef(function ImageChoice({ label, bitmap_key, slide_dir, animData, appInst }, selfRef) {

    const onLoad = () => {
        for (const canvas of selfRef.current.getElementsByTagName('canvas')) {
            //const bitmap = GetDesiredBitmapForCanvas(canvas, appInst)
            //DrawBitmapToCanvasCentered(bitmap, canvas)
        }
    }

    useEffect(onLoad)

    return (
        <div className='ImageChoice' ref={selfRef}>
            <h2 className="label">{label}</h2>

            <div id='imgFrame0' className="imgFrame">
                <Slide direction={slide_dir} timeout={animData.reset ? 0 : 500} in={!animData.slideAway} mountOnEnter unmountOnExit>
                    {ImageFrame()}
                </Slide>
            </div>
            <div id='imgFrame1' className="imgFrame">
                <Fade in={animData.fadeIn} timeout={animData.reset ? 0 : 500}>
                    {ImageFrame()}
                </Fade>
            </div>
        </div>
    );
});

export default ImageChoice;

ImageChoice.propTypes = {
    bitmap_key: PropTypes.string,
    label: PropTypes.string,
    slide_dir: PropTypes.string,
    animData: PropTypes.object,
    appInst: PropTypes.object
}

ImageFrame.propTypes = {
    canvas_id: PropTypes.string
}