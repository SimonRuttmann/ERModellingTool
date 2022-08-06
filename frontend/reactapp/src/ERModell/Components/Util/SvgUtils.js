/**
 *
 * @param width
 * @param displayText
 * @param fontSize
 * @param fontFamily
 * @returns {number|*}
 */
const resolveRequiredWidth = (width, displayText, fontSize, fontFamily) => {

    let textWidth = getTextWidth(displayText, `${fontSize}pt ${fontFamily}`);

    if(textWidth > width) return textWidth
    return width
}

/**
 *
 * @param text
 * @param font
 * @returns {number}
 */
const getTextWidth = (text, font) => {

    let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));

    let context = canvas.getContext("2d");
    context.font = font;

    return context.measureText(text).width;
}

/**
 *
 * @param width
 * @param displayText
 * @param fontFamily
 * @param initialFontSize
 * @returns {number|*}
 */
const resolveRequiredFontSize = (width, displayText, fontFamily, initialFontSize) => {

    const initialTextWidth = getTextWidth(displayText, `${initialFontSize}pt ${fontFamily}`);

    if(initialTextWidth <= width) return initialFontSize;

    let adjustedTextWidth = initialTextWidth;
    let adjustedFontSize = initialFontSize;
    while(adjustedTextWidth > width){
        adjustedFontSize = adjustedFontSize -1;
        adjustedTextWidth = getTextWidth(displayText, `${adjustedFontSize}pt ${fontFamily}`);
        if(adjustedFontSize < 5) break;
    }

    return adjustedFontSize;
}

/**
 *
 * @returns {{top: number, left: number, bottom: number, right: number}}
 */
const getBoundsOfSvg = () => {

    let svgContainer = document.getElementById("boxesContainer");
    if(svgContainer === null) return;
    let bounds = svgContainer.getBoundingClientRect();

    return {
        right: bounds.right,
        left: bounds.left,
        top: bounds.top,
        bottom: bounds.bottom}

}

/**
 * Util holding functions to resolve the size of svg`s,
 * the width of the display text hold by the svg or which
 * font size is required to fit into a given width
 */
const SvgUtil = {
    resolveRequiredWidth: resolveRequiredWidth,
    getTextWidth: getTextWidth,
    resolveRequiredFontSize: resolveRequiredFontSize,
    getBoundsOfSvg: getBoundsOfSvg
}

export default SvgUtil;