import { Coordinates } from "@/types";
import getPathLength from "@/utils/getPathLength";

function createCurvedPathD(points: Coordinates[]): string {
  if (points.length < 2) return '';

  const path: string[] = [];
  
  path.push(`M ${points[0].x},${points[0].y}`);

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];

    const smoothing = 0.2;

    const controlPointPrev = i > 0 ? points[i - 1] : curr;
    const controlPointNext = i < points.length - 2 ? points[i + 2] : next;

    const controlPointX1 = curr.x + (next.x - controlPointPrev.x) * smoothing;
    const controlPointY1 = curr.y + (next.y - controlPointPrev.y) * smoothing;

    const controlPointX2 = next.x - (controlPointNext.x - curr.x) * smoothing;
    const controlPointY2 = next.y - (controlPointNext.y - curr.y) * smoothing;

    path.push(`C ${controlPointX1},${controlPointY1} ${
      controlPointX2},${controlPointY2} ${
      next.x},${next.y}`);
  }
  
  return path.join(' ');
}


export const createPath = (
  coordinates: Coordinates[],
  activeLevel: number,
  options: {
    pathClassName?: string,
    activePathClassName?: string,
    activeBackPathClassName?: string,
  },
): JSX.Element => {
  const {
    pathClassName,
    activePathClassName,
    activeBackPathClassName,
  } = options;
  const activeCoordinates = coordinates.slice(0, activeLevel);

  const pathD = createCurvedPathD(coordinates);
  const activePathD = createCurvedPathD(activeCoordinates);

  const pathElement = document.querySelector<SVGPathElement>(
      '#path')!;
  const activePathElement = document.querySelector<SVGPathElement>(
      '#path-active')!;

  const pathLength = getPathLength(pathElement);
  const activePathLength = getPathLength(activePathElement);

  return (
    <>
      <path
        id="path"
        d={pathD}
        className={`${pathClassName}`}
      />
      {activeCoordinates.length && (
        <>
          <path
            d={activePathD}
            className={`${pathClassName} ${activePathClassName} ${activeBackPathClassName}`}
            strokeDasharray={`${activePathLength}`}
            strokeDashoffset={pathLength}
          />
          <path
            id="path-active"
            d={activePathD}
            className={`${pathClassName} ${activePathClassName}`}
            strokeDasharray={`${activePathLength}`}
            strokeDashoffset={pathLength}
          />
        </>
      )}
    </>
  );
};
