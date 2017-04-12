import marked from 'marked';
import get from 'lodash/get';

// Helper Constants
export const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * Generate a Contentful Image URL with added url parameters.
 *
 * @param  {String} url
 * @param  {String} width
 * @param  {String} height
 * @param  {String} fit
 * @return {String}
 */
export function contentfulImageUrl(url, width = null, height = null, fit = null) {
  let params = [];

  if (width) {
    params.push(`w=${width}`);
  }

  if (height) {
    params.push(`h=${height}`);
  }

  if (fit) {
    params.push(`fit=${fit}`);
  }

  return params.length ? `${url}?${params.join('&')}` : url;
}

/**
 * Ensure a user is authenticated. If not, redirect them
 * to log in via the OpenID Connect flow.
 * @param isAuthenticated
 * @returns {boolean}
 */
export function ensureAuth(isAuthenticated) {
  if (! isAuthenticated) {
    window.location.href = '/next/login';
    return false;
  }

  return true;
}

/**
 * Wait until the DOM is ready.
 *
 * @param {Function} fn
 */
export function ready(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/**
 * Render Markdown for a React component.
 *
 * @param {String} source - Markdown source
 * @returns {{__html}} - Prepared object for React's dangerouslySetInnerHtml
 */
export function markdown(source) {
  // Markdown options <https://github.com/chjj/marked#options-1>
  const options = {
    sanitize: true
  };

  return {
    __html: marked(source, options),
  }
}

/**
 * Prefix a class name or array of class names.
 * @param {String|Array} classes
 */
export function modifiers(...classes) {
  if (! Array.isArray(classes)) classes = [classes];

  return classes.filter(className => className).map(className => `-${className}`);
}

/**
 * Process file (provided as an ArrayBuffer) depending
 * on its type.
 *
 * @param  {ArrayBuffer} file
 * @return {Blob}
 * @todo Eventually deal with other file types.
 */
export function processFile(file) {
  let fileType = getFileType(file);
  let dataView = new DataView(file);

  if (fileType === 'image/png') {
    return new Blob([dataView], { type: fileType });
  }

  if (fileType === 'image/jpeg') {
    return stripExifData(file, dataView);
  }

  throw 'Unsupported file type.';
}

/**
 * Get the type for a specified file.
 *
 * @param  {ArrayBuffer} file
 * @return {String|null}
 * @todo Eventually deal with other file types.
 */
function getFileType(file) {
  let dv = new DataView(file, 0, 5);
  let byte1 = dv.getUint8(0, true);
  let byte2 = dv.getUint8(1, true);
  let hex = byte1.toString(16) + byte2.toString(16);

  return get({
    '8950': 'image/png',
    '4749': 'image/gif',
    '424d': 'image/bmp',
    'ffd8': 'image/jpeg'
  }, hex, null);
}

/**
 * Remove EXIF data on specified file if present.
 *
 * @param  {ArrayBuffer} image
 * @param  {DataView} dataView
 * @return {Blob}
 */
function stripExifData(image, dataView = null) {
  if (! dataView) {
    let dataView = new DataView(image);
  }

  let offset = 0;
  let recess = 0;
  let pieces = [];
  let i = 0;

  offset += 2;
  var app1 = dataView.getUint16(offset);
  offset += 2;

  // This loop does the acutal reading of the data and creates
  // an array with only the pieces we want.
  while (offset < dataView.byteLength) {
    if (app1 === 0xffe1) {
      pieces[i] = {
        recess : recess,
        offset : offset - 2
      };

      recess = offset + dataView.getUint16(offset);

      i++;
    }
    else if (app1 === 0xffda) {
      break;
    }

    offset += dataView.getUint16(offset);
    app1 = dataView.getUint16(offset);
    offset += 2;
  }

  // If the file had EXIF data and it was removed, create a
  // file blob using the new array of file data.
  if (pieces.length > 0) {
    var newPieces = [];

    pieces.forEach(function(v) {
      newPieces.push(image.slice(v.recess, v.offset));
    }, this);

    newPieces.push(image.slice(recess));

    return new Blob(newPieces, {type: 'image/jpeg'});
  }

  // If no EXIF data existed on the file, then nothing was done to it.
  // We can just create a blob with the original data.
  else {
    return new Blob([dataView], {type: 'image/jpeg'});
  }
}

/**
 * Generate a random unique id based on the current time
 * and a random 5 digit number.
 *
 * @return {String}
 */
export function generateUniqueId() {
  const salt = Math.floor(Math.random() * 90000) + 10000;
  return `${Date.now()}${salt}`;
}

/**
 * Check if the given timestamp has exceeded its lifespan of max time.
 *
 * @param  {int}  timestamp    Timestamp in milliseconds.
 * @param  {int}  maxTime      Max life in milliseconds.
 * @return {Boolean}
 */
export function isTimestampValid(timestamp, maxTime) {
  return (timestamp + maxTime) > Date.now();
}

/**
 * Convert an int to a string. (Supports 0-10)
 * @param  {int} number
 * @return {String}
 */
export function convertNumberToWord(number) {
  switch(number) {
    case 0: return 'zero';
    case 1: return 'one';
    case 2: return 'two';
    case 3: return 'three';
    case 4: return 'four';
    case 5: return 'five';
    case 6: return 'six';
    case 7: return 'seven';
    case 8: return 'eight';
    case 9: return 'nine';
    case 10: return 'ten';
    default: throw new Error('Number out of range');
  }
}

/**
 * Make a hash from a specified string.
 * @see  http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 *
 * @param  {String} string
 * @return {String}
 */
export function makeHash(string) {
  let hash = 0;

  if (!string.length) {
    return hash;
  }

  string.split('').forEach((char, index) => {
    char = string.charCodeAt(index);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  });

  return Math.abs(hash);
}

/**
 * Get the days between two Date objects
 * @see  http://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates-using-javascript
 *
 * @param  {Date} dateOne
 * @param  {Date} dateTwo
 * @return {int}
 */
export function getDaysBetween(dateOne, dateTwo) {
  const oneDay = 24*60*60*1000;

  return Math.round(Math.abs((dateOne.getTime() - dateTwo.getTime()) / oneDay));
}
