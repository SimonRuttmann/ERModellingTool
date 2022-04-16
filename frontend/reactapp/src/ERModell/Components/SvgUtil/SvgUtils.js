function resolveRequiredWidth(width, displayText, fontSize, fontFamily){

    var textWidth = getTextWidth(displayText, `${fontSize}pt ${fontFamily}`)
    if(textWidth > width) return textWidth
    return width
}

function getTextWidth(text, font) {

    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));

    var context = canvas.getContext("2d");
    context.font = font;

    return context.measureText(text).width;
}

export default resolveRequiredWidth