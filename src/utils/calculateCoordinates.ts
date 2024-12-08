import { Coordinates, Position } from "@/types";

const LEVEL_WIDTH_PX = 80;

export const calculateCoordinates = (
  position: Position,
  containerWidth: number,
  offsetHeight: number
): Coordinates => ({
  x: Math.round((parseFloat(position.left) / 100) * containerWidth),
  y: Math.round(offsetHeight - position.bottom - LEVEL_WIDTH_PX / 2),
});
