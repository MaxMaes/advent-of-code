/**
 * Calculates the value of the passed character
 *  A-Z ranges from 65 up to (incl) 90
 * a-z ranges from 97 up to (incl) 122
 * @param inputChar character to calc
 * @returns Character value
 */
export default function getCharValue(inputChar: string) {
  if (inputChar.length > 1)
    throw Error("Only input single character strings, received " + inputChar);

  const charCode = inputChar.charCodeAt(0);
  let value = 0;
  if (charCode > 90) {
    // a-z
    value = charCode - 96;
  } else {
    // A-Z
    value = charCode - 38;
  }
  return value;
}
