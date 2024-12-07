import { Coordinates, Path, PathEndpoint, PathType, Position } from "@/types";
import { Fragment } from "react";
import { getCenterToLeftPathD, getCenterToRightPathD, getLeftToCenterPathD, getRightToLeftPathD } from "@/utils/pathD";

export const calculatePosition = (
  position: Position,
  containerWidth: number,
  offsetHeight: number
): Coordinates => ({
  x: (parseFloat(position.left) / 100) * containerWidth,
  y: offsetHeight - position.bottom - 40,
});

export const convertPercentToPosition = (percent: string): PathEndpoint => {
  const percentValue = parseFloat(percent);

  if (percentValue >= 40 && percentValue <= 60) return PathEndpoint.CENTER;
  if (percentValue >= 0 && percentValue < 40) return PathEndpoint.LEFT;
  if (percentValue > 60 && percentValue <= 100) return PathEndpoint.RIGHT;

  throw new Error(`Invalid percent: ${percent}`);
};

export const calculatePathType = (start: string, end: string): PathType => {
  const startPosition = convertPercentToPosition(start);
  const endPosition = convertPercentToPosition(end);

  return `${startPosition}_${endPosition}` as PathType;
};

const createPathD = (path: Path, pathType: PathType): string => {
  switch (pathType) {
    case (PathType.CENTER_LEFT):
      return getCenterToLeftPathD(path);
    case (PathType.RIGHT_LEFT):
      return getRightToLeftPathD(path);
    case (PathType.CENTER_RIGHT):
      return getCenterToRightPathD(path);
    default:
      return getLeftToCenterPathD(path);
  }
};

export const createPath = (
  path: Path,
  pathType: PathType,
  options: {
    isActive: boolean,
    key?: number,
    pathClassName?: string,
    activePathClassName?: string,
    activeBackPathClassName?: string,
  },
): JSX.Element => {
  const {
    isActive,
    key,
    pathClassName,
    activePathClassName,
    activeBackPathClassName,
  } = options;

  const pathD = createPathD(path, pathType);
  const pathLength = Math.min(window.innerWidth, 1024) * 1.2;

  return (
    <Fragment key={key}>
      {isActive && 
        (
          <path
            key={`path-active-back-${key}`}
            d={pathD}
            className={`${pathClassName} ${activePathClassName ?? 'active'} ${activeBackPathClassName ?? 'back'}`}
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength}
          />
        )
      }
      <path
        key={`path-${key}`}
        d={pathD}
        className={`${pathClassName}`}
      />
      {isActive && 
        (
          <path
            key={`path-active-${key}`}
            d={pathD}
            className={`${pathClassName} ${activePathClassName ?? 'active'}`}
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength}
          />
        )
      }
    </Fragment>
  );
};
