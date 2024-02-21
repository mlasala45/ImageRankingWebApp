import './ImageChoice.css'
import { ThemeProvider, createTheme } from '@mui/system';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import { forwardRef } from 'react';


const ImageFrame = (img_path) => (
    <Box sx={{
        bgcolor: '#3f3f47',
        borderColor: 'black',
        border: 1,
        height: 1
    }}>
        <img className='img' src={img_path} ></img>
    </Box>
);

export default function ImageChoice({ label, img_path, slide_dir, animData }) {
    return (
        <div className='ImageChoice'>
            <h2 className="label">{label}</h2>

            <div id='imgFrame0' className="imgFrame">
                <Slide direction={slide_dir} timeout={animData.reset ? 0 : 500} in={!animData.slideAway} mountOnEnter unmountOnExit>
                    {ImageFrame(img_path)}
                </Slide>
            </div>
            <div id='imgFrame1' className="imgFrame">
                <Fade in={animData.fadeIn} timeout={animData.reset ? 0 : 500}>
                    {ImageFrame(img_path)}
                </Fade>
            </div>
        </div>
    )
}

ImageChoice.propTypes = {
    img_path: PropTypes.string,
    label: PropTypes.string,
    slide_dir: PropTypes.string,
    animData: PropTypes.object
}

ImageFrame.propTypes = {
    img_path: PropTypes.string
}