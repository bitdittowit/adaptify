export interface User {
    id: number;
    name: string;
    sex: Sex;
    country: Country;
    arrival_date: Date | null;
    study_group: StudyGroup;
    experience: number;
    level: number;
    tasks: Task[];
}

export interface UserLevelSummary {
    level: number;
    experience: number;
    totalExperience: number;
}

// TODO (dbo) add Country enum
export type Country = string;

// TODO (dbo) add StudyGroup enum
export type StudyGroup = string;

export type Sex = 'male' | 'female';

export type VisaType = 'visa_free' | 'visa_required';

export enum STATUS {
    OPEN = 'open',
    PENDING = 'pending',
    FINISHED = 'finished',
}

export interface BaseTask {
    id: number;
    title: string;
    description: string;
    required: boolean;
    position: number;
    // Array of blocking tasks ids.
    blocking_tasks: number[];
    tags: Array<Sex | VisaType>;
    schedule: Schedule | null;
    proof: ProofTask | null;
}

export interface Task extends BaseTask {
    status: STATUS;
    picked_date: Date | string;
    experience_points: number;
    proof_status: ProofStatus;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// 'HH:MM-HH:MM'
export type TimeRange = `${string}:${string}-${string}:${string}`;

export type Schedule = {
    [K in DayOfWeek]: TimeRange[];
};

export interface ProofTask {
    action: string;
    checks: CheckTask[];
    status: ProofStatus;
}

export type ProofStatus = 'not_proofed' | 'checking' | 'proofed';

export interface CheckTask {
    name: string;
    title: string;
    placeholder: string;
    type: CheckTaskType;
}

export type CheckTaskType = 'date' | 'string' | 'number';

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
