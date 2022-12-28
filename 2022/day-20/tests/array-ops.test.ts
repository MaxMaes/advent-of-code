import { moveElement, shiftElementBy } from "../array-ops";

// test("move-array", () => {
//   const testArray = [1, 2, -3, 3, -2, 0, 4];
//   moveElement(testArray, 0, 1);
//   expect(testArray[1]).toBe(1);
// });

// test("move-array", () => {
//   const testArray = [1, 2, -3, 3, -2, 0, 4];
//   moveElement(testArray, 0, -1);
//   expect(testArray[testArray.length - 2]).toBe(1);
// });

// test("shift-array right 1", () => {
//   const testArray = [1, 2, -3, 3, -2, 0, 4];
//   const resultArray = shiftElementBy(testArray, 0, 1);
//   expect(resultArray).toEqual([2, 1, -3, 3, -2, 0, 4]);
// });

// test("shift-array right 5", () => {
//   const testArray = [1, 2, -3, 3, -2, 0, 4];
//   const resultArray = shiftElementBy(testArray, 0, 5);
//   expect(resultArray).toEqual([2, -3, 3, -2, 0, 1, 4]);
// });

// test("shift-array right 6", () => {
//   const testArray = [1, 2, -3, 3, -2, 0, 4];
//   const resultArray = shiftElementBy(testArray, 0, 6);
//   expect(resultArray).toEqual([2, -3, 3, -2, 0, 4, 1]);
// });

// test("shift-array right 12", () => {
//   const testArray = [1, 2, -3, 3, -2, 0, 4];
//   const resultArray = shiftElementBy(testArray, 0, 12);
//   expect(resultArray).toEqual([2, -3, 3, -2, 0, 4, 1]);
// });

// test("shift-array left 1", () => {
//   const testArray = [1, 2, -2, -3, 0, 3, 4];
//   const resultArray = shiftElementBy(testArray, 0, -1);
//   expect(resultArray).toEqual([2, -2, -3, 0, 3, 1, 4]);
// });

// test("shift-array left 3", () => {
//   const testArray = [-3, 1, 2, 3, -2, 0, 4];
//   const resultArray = shiftElementBy(testArray, 0, -3);
//   expect(resultArray).toEqual([1, 2, 3, -3, -2, 0, 4]);
// });

test("shift-array left 6", () => {
  const testArray = [1, 2, -2, -3, 0, 3, 4];
  const resultArray = shiftElementBy(testArray, 0, -6);
  expect(resultArray).toEqual([2, -2, -3, 0, 3, 4, 1]);
});

test("shift-array left 12", () => {
  const testArray = [1, 2, -2, -3, 0, 3, 4];
  const resultArray = shiftElementBy(testArray, 0, -12);
  expect(resultArray).toEqual([2, -2, -3, 0, 3, 4, 1]);
});

// test("shift-array left 4225 -6153 3071 8070", () => {
//   const testArray = new Array(5000);
//   testArray[4225] = { val: -6153, idx: 4225 };
//   const resultArray = shiftElementBy(testArray, 4225, -6153);
//   expect(resultArray[3071]).toEqual({ val: -6153, idx: 4225 });
// });
