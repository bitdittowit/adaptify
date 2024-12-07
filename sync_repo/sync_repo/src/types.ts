export interface Coordinates {
  x: number;
  y: number;
}

export interface Position {
  bottom: number;
  left: string;
}

export interface Level {
  id: number;
  position: Position;
}

export interface Path {
  start: Coordinates,
  end: Coordinates,
}

export const enum PathEndpoint {
  LEFT = 'LEFT',
  CENTER = 'CENTER',
  RIGHT = 'RIGHT',
};

export const enum PathType {
  LEFT_LEFT = 'LEFT_LEFT',
  LEFT_CENTER = 'LEFT_CENTER',
  LEFT_RIGHT = 'LEFT_RIGHT',
  CENTER_LEFT = 'CENTER_LEFT',
  CENTER_CENTER = 'CENTER_CENTER',
  CENTER_RIGHT = 'CENTER_RIGHT',
  RIGHT_LEFT = 'RIGHT_LEFT',
  RIGHT_CENTER = 'RIGHT_CENTER',
  RIGHT_RIGHT = 'RIGHT_RIGHT',
};
