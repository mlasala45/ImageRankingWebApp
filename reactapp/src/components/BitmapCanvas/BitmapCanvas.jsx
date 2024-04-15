import { useEffect, useState, useRef, forwardRef } from 'react';
import { DrawBitmapToCanvasCentered } from '../../util/BitmapUtil';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

const BitmapCanvas = forwardRef(function BitmapCanvas({ bitmap, name, width, height, setBitmapRef }) {
    const [useImg,setUseImg] = useState(false)
    const canvasRef = useRef(null)
    function setBitmap(bitmap) {
        DrawBitmapToCanvasCentered(bitmap, canvasRef.current)
    }

    setBitmapRef = setBitmap

    useEffect(() => {
        if (typeof bitmap == "string") {
            setUseImg(true)
        }
        else {
            if (bitmap != null) setBitmap(bitmap)
        }
    })

    let content = null
    if (useImg) {
        content = <img src={bitmap} style={{ width: '100%', height: '100%' }} width={width} height={height} />
    }
    else {
        content = <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} width={width} height={height} />
    }

    return (
        <Tooltip title={name}>
            <Box sx={{
                bgcolor: '#3f3f47',
                borderColor: 'black',
                border: 1,
                height: 1
            }}>
                {content}</Box>
        </Tooltip>);
})

export default BitmapCanvas

BitmapCanvas.propTypes = {
    bitmap: PropTypes.any,
    name: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    setBitmapRef: PropTypes.object
}