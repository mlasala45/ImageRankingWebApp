export function DrawBitmapToCanvasCentered(bitmap, canvas) {
    const img = bitmap;
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

export function GetDesiredBitmapForCanvas(canvas, appInst, datasetKey) {
    return appInst.state.bitmaps[datasetKey][canvas.dataset.imgKey];
}

export function GetBitmapFromActiveDataset(appInst, bitmapKey) {
    return appInst.state.bitmaps[appInst.state.activeDatasetKey][bitmapKey]
}