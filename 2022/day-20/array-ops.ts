export function moveElement<T>(
  array: Array<T>,
  fromIndex: number,
  toIndex: number
) {
  const elementToMove = array.splice(fromIndex, 1)[0];
  //   console.log(elementToMove, "from", fromIndex, "to", toIndex);
  array.splice(toIndex, 0, elementToMove);
}

export function shiftElementBy<T>(
  array: Array<T>,
  indexToShift: number,
  shiftValue: number
) {
  const shiftValues = Math.abs(shiftValue);
  const sign = Math.sign(shiftValue);
  let objIdx = indexToShift;
  if (sign > 0) {
    const corrector = Math.floor((indexToShift + shiftValue) / array.length);
    objIdx = Math.max(
      1,
      (((objIdx + shiftValue) % array.length) + corrector) % array.length
    );
  } else if (sign < 0) {
    for (let shiftIdx = 0; shiftIdx < shiftValues; shiftIdx++) {
      objIdx = objIdx + sign;
      if (objIdx <= 0) {
        objIdx = array.length - 1;
      }
    }
  }

  moveElement(array, indexToShift, objIdx);
  return array;
}
