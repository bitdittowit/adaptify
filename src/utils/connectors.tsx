import { Coordinates } from "@/types";

export const calculatePosition = (
  position: { bottom: number; left: string },
  containerWidth: number,
  offsetHeight: number
): Coordinates => ({
  x: (parseFloat(position.left) / 100) * containerWidth,
  y: offsetHeight - position.bottom - 40,
});

export const createPath = (
  start: Coordinates,
  end: Coordinates,
  isActive: boolean,
  key?: number,
  pathClassName?: string,
  activePathClassName?: string,
): JSX.Element => {
  const controlPointX = (start.x + end.x) / 2;
  const verticalOffset = Math.abs(start.y - end.y) / 3;

  return (
    <path
      key={key}
      d={`M ${start.x} ${start.y} C ${controlPointX} ${end.y - verticalOffset} ${controlPointX} ${start.y + verticalOffset} ${end.x} ${end.y}`}
      className={`${pathClassName} ${isActive ? activePathClassName ?? 'active' : ''}`}
    />
  );
};
