import { Coordinates } from "@/types";
import { Fragment } from "react";

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
  activeBackPathClassName?: string,
): JSX.Element => {
  const controlPointX = (start.x + end.x) / 2;
  const verticalOffset = Math.abs(start.y - end.y) / 3;

  return (
    <Fragment key={key}>
      {isActive && 
        (
          <path
            key={`path-active-back-${key}`}
            d={`M ${start.x} ${start.y} C ${controlPointX} ${end.y - verticalOffset} ${controlPointX} ${start.y + verticalOffset} ${end.x} ${end.y}`}
            className={`${pathClassName} ${activePathClassName ?? 'active'} ${activeBackPathClassName ?? 'back'}`}
            strokeDasharray={window.innerWidth}
            strokeDashoffset={window.innerWidth}
          />
        )
      }
      <path
        key={`path-${key}`}
        d={`M ${start.x} ${start.y} C ${controlPointX} ${end.y - verticalOffset} ${controlPointX} ${start.y + verticalOffset} ${end.x} ${end.y}`}
        className={`${pathClassName}`}
      />
      {isActive && 
        (
          <path
            key={`path-active-${key}`}
            d={`M ${start.x} ${start.y} C ${controlPointX} ${end.y - verticalOffset} ${controlPointX} ${start.y + verticalOffset} ${end.x} ${end.y}`}
            className={`${pathClassName} ${activePathClassName ?? 'active'}`}
            strokeDasharray={window.innerWidth}
            strokeDashoffset={window.innerWidth}
          />
        )
      }
    </Fragment>
  );
};
