export interface User {
    id: number;
    name: string;
    email: string;
    image?: string | null;
    sex: Sex;
    country: Country;
    arrival_date: Date | null;
    study_group: StudyGroup;
    experience: number;
    level: number;
    tasks: Task[];
    role: Role;
}

export interface UserLevelSummary {
    level: number;
    experience: number;
    totalExperience: number;
}

export interface Link {
    url: string;
    description: LocalizedText;
}

export interface Contacts {
    phones?: Array<{ title?: LocalizedText; value: string }>;
    emails?: Array<{ title?: LocalizedText; value: string }>;
}

export interface Address {
    title: LocalizedText | null;
    value: LocalizedText;
}

export type Cost = LocalizedText;

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

export interface LocalizedText {
    ru: string;
    en?: string;
}

export interface BaseTask {
    id: number;
    title: LocalizedText;
    description: LocalizedText;
    required: boolean;
    position: number;
    // Array of blocking tasks ids.
    blocks: number[];
    blocked_by: number[];
    tags: Array<Sex | VisaType>;
    schedule: Schedule | null;
    proof: ProofTask | null;
    documents: LocalizedText[] | null;
    links: Link[] | null;
    medical_procedures?: LocalizedText[];
    address: Address[] | null;
    contacts: Contacts | null;
    cost?: Cost;
    clubs?: LocalizedText[];
    // New fields for task scheduling
    priority: number; // 1-5, where 1 is highest priority
    deadline_days: number | null; // Number of days after arrival to complete the task, null if no strict deadline
    duration_minutes: number; // Approximate duration of the task in minutes
}

export interface Task extends BaseTask {
    status: STATUS;
    picked_date: Date | string;
    experience_points: number;
    proof_status: ProofStatus;
    available: boolean;
}

export interface SchedulableTask extends Task {
    user_task_id: number;
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
    title: LocalizedText;
    placeholder: string;
    type: CheckTaskType;
}

export type CheckTaskType = 'date' | 'text' | 'number';

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

export interface ProofCheck {
    type: 'date' | 'number' | 'text';
    name: string;
    title: LocalizedText;
    placeholder?: string;
}

export type Role = 'admin' | 'user';
