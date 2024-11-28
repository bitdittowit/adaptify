import { Path } from "@/types";
import { STEP } from "./constants";

export const getLeftToCenterPathD = (path: Path): string => {
  const {start, end} = path;

  const controlPointX = (start.x + end.x) / 2;
  const verticalOffset = STEP / 4;

  return `M ${
    start.x
  } ${
    start.y
  } C ${
    controlPointX
  } ${
    end.y - verticalOffset
  } ${
    controlPointX
  } ${
    start.y + verticalOffset
  } ${
    end.x
  } ${
    end.y
  }`;
};

export const getCenterToRightPathD = (path: Path): string => {
  return getLeftToCenterPathD(path);
};

export const getCenterToLeftPathD = (path: Path): string => {
  const {start, end} = path;

  const controlPointStartX = start.x + STEP;
  const controlPointEndX = end.x - STEP;
  const verticalOffset = STEP;

  return `M ${
    start.x
  } ${
    start.y
  } C ${
    controlPointStartX
  } ${
    end.y - verticalOffset
  } ${
    controlPointEndX
  } ${
    start.y + verticalOffset
  } ${
    end.x
  } ${
    end.y
  }`;
};

export const getRightToLeftPathD = (path: Path): string => {
  return getCenterToLeftPathD(path);
};
