// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite( bgImg, fgImg, fgOpac, fgPos ){
    var bgWidth = bgImg.width;
    var bgHeight = bgImg.height;
    var fgWidth = fgImg.width;
    var fgHeight = fgImg.height;

    var startX = Math.max(0, fgPos.x); 
    var startY = Math.max(0, fgPos.y); 
    var endX = Math.min(bgWidth, fgPos.x+fgWidth); 
    var endY = Math.min(bgHeight, fgPos.y+fgHeight);

    for (var y = startY; y<endY; y++) {
        for (var x = startX; x<endX; x++) {
            var bgIndex = (y*bgWidth+x)*4; 
            var fgIndex = ((y-fgPos.y)*fgWidth+(x-fgPos.x))*4; 
            
            var blendingR = fgImg.data[fgIndex] * (fgImg.data[fgIndex+3]*fgOpac)/255 + bgImg.data[bgIndex] * (1-(fgImg.data[fgIndex+3]*fgOpac)/255);
            var blendingG = fgImg.data[fgIndex+1] * (fgImg.data[fgIndex+3]*fgOpac)/255 + bgImg.data[bgIndex+1] * (1-(fgImg.data[fgIndex+3]*fgOpac)/255);
            var blendingB = fgImg.data[fgIndex+2] * (fgImg.data[fgIndex+3]*fgOpac)/255 + bgImg.data[bgIndex+2] * (1-(fgImg.data[fgIndex+3]*fgOpac)/255);
            var blendingA = bgImg.data[bgIndex+3]; 
           
            bgImg.data[bgIndex] = blendingR;
            bgImg.data[bgIndex+1] = blendingG;
            bgImg.data[bgIndex+2] = blendingB;
            bgImg.data[bgIndex+3] = blendingA;
        }
    }
}
