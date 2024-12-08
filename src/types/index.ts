export interface User {
  id: number,
  name: string,
  sex: Sex,
  country: Country,
  arrival_date: Date;
  study_group: StudyGroup;
  experience: number;
  level: number;
  tasks: UserTask[];
}

  // TODO (dbo) add Country enum
export type Country = string;

  // TODO (dbo) add StudyGroup enum
export type StudyGroup = string;

export type Sex = 'male' | 'female';

export type VisaType = 'visa_free' | 'visa_required';

export const enum Status {
  OPEN = 'open',
  PENDING = 'pending',
  FINISHED = 'finished',
};

export interface Task {
  id: number,
  title: string;
  description: string;
}

// Temp type for json properties.
export interface RawTask extends Task {
  required: boolean;
  position: number;
}

export interface UserTask extends Task {
  status: Status;
  picked_date: Date;
}

export interface DocumentTask extends Task {
  // TODO (dbo) add Schedule type
  schedule: string;
  possible_dates: Date[];
}

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
