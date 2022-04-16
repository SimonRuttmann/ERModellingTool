function resolveRequiredWidth(width, displayText, fontSize, fontFamily){

    let textWidth = getTextWidth(displayText, `${fontSize}pt ${fontFamily}`);

    if(textWidth > width) return textWidth
    return width
}

function getTextWidth(text, font) {

    let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));

    let context = canvas.getContext("2d");
    context.font = font;

    return context.measureText(text).width;
}

export default resolveRequiredWidth