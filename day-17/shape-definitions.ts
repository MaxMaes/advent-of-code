import { Coordinate } from "./day-17a";

export type ShapeDefinition = Array<Coordinate>;
export const hLineShape: ShapeDefinition = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 1,
    y: 0,
  },
  {
    x: 2,
    y: 0,
  },
  {
    x: 3,
    y: 0,
  },
];
export const plusShape: ShapeDefinition = [
  {
    x: 1,
    y: 0,
  },
  {
    x: 0,
    y: 1,
  },
  {
    x: 1,
    y: 1,
  },
  {
    x: 2,
    y: 1,
  },
  {
    x: 1,
    y: 2,
  },
];

export const LShape: ShapeDefinition = [
  {
    x: 2,
    y: 0,
  },
  {
    x: 2,
    y: 1,
  },
  {
    x: 2,
    y: 2,
  },
  {
    x: 1,
    y: 0,
  },
  {
    x: 0,
    y: 0,
  },
];

export const vLineShape: ShapeDefinition = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 0,
    y: 1,
  },
  {
    x: 0,
    y: 2,
  },
  {
    x: 0,
    y: 3,
  },
];

export const squareShape: ShapeDefinition = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 1,
    y: 1,
  },
  {
    x: 0,
    y: 1,
  },
  {
    x: 1,
    y: 0,
  },
];
