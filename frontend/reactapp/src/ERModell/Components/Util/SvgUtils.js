/**
 * Determines the correct width to use for svg render elements
 * @param width The current width
 * @param displayText The text to display
 * @param fontSize The font size of the display text
 * @param fontFamily The font family of the display text
 * @returns {number|*} Returns the given width, if it has enough space for the text.
 *                     Otherwise, the minimal width required to display the text
 */
const resolveRequiredWidth = (width, displayText, fontSize, fontFamily) => {

    let textWidth = getTextWidth(displayText, `${fontSize}pt ${fontFamily}`);

    if(textWidth > width) return textWidth
    return width
}

/**
 * Resolves the width of the text, when it would be displayed at the website for a given font
 * @param text The text
 * @param font The font of the text
 * @returns {number} The width of the text
 */
const getTextWidth = (text, font) => {

    let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));

    let context = canvas.getContext("2d");
    context.font = font;

    return context.measureText(text).width;
}

/**
 * Determines the correct font size to use for svg render elements
 * @param width The current width
 * @param displayText The text to display
 * @param fontFamily The font size of the display text
 * @param initialFontSize The initially given font size of the display text
 * @returns {number|*} Returns the initial font size, if it matches the given width.
 *                     Otherwise, a reduced font size to match the given width
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
 * Determines the bounds of the drawBoard svg
 * @returns {{top: number, left: number, bottom: number, right: number}}
 */
const getBoundsOfSvg = () => {

    let svgContainer = document.getElementById("boxesContainer");
    if(svgContainer === null) return {right: 0, left: 0, top: 0, bottom: 0};
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