/**
 * Enables the resizing of the display text`s font to fit the default width provided by
 * @see defaultTextToFit
 * @type {boolean}
 */
const enableTextResizeBasedOnDisplayText = true;

/**
 * Enables the resizing of the elements to fit the display text with no adjustment of the font
 * @type {boolean}
 */
const enableSvgResizeBasedOnDisplayText = false;

/**
 * Defines the width every element requires at least to fit without font adjustment
 * @type {string}
 */
const defaultTextToFit = "WWWWWWWWWW"

/**
 * Defines the maximum length of the display text allowed for elements
 * @type {number}
 */
const maxLengthForElements = 20;

/**
 * With this configuration the resize behaviour
 * of DrawingBoardRenderedElements can be adjusted
 */
const DisplayConfiguration = {
    enableTextResizeBasedOnDisplayText: enableTextResizeBasedOnDisplayText,
    enableSvgResizeBasedOnDisplayText: enableSvgResizeBasedOnDisplayText,
    defaultTextToFit: defaultTextToFit,
    maxLengthForElements: maxLengthForElements
}

export default DisplayConfiguration;