import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import rawTasksData from '@/constants/tasks/user_tasks.json';
import type { BaseTask } from '@/types';
import preprocessTasks from '@/utils/backend-potential/preprocess-tasks';

const tasksData = preprocessTasks(rawTasksData.tasks as unknown as BaseTask[]);

async function seedData() {
    console.log('start to seed data');

    await db.query('DROP TABLE IF EXISTS user_tasks');
    console.log('user_tasks dropped');
    await db.query('DROP TABLE IF EXISTS tasks');
    console.log('tasks dropped');
    await db.query('DROP TABLE IF EXISTS users');
    console.log('users dropped');

    await db.query(
        `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            image VARCHAR(255),
            sex VARCHAR(6) CHECK(sex IN ('male', 'female')),
            country VARCHAR(255),
            arrival_date TIMESTAMP DEFAULT NULL,
            study_group VARCHAR(255),
            experience INT DEFAULT 0,
            level INT DEFAULT 1,
            completed_tasks INTEGER[] DEFAULT '{}'
        );`,
    );
    console.log('users created');

    await db.query(
        `CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            required BOOLEAN DEFAULT FALSE,
            position INT,
            blocks INTEGER[],
            blocked_by INTEGER[],
            tags TEXT[],
            schedule JSONB,
            proof JSONB,
            documents TEXT[] DEFAULT NULL,
            links TEXT[] DEFAULT NULL,
            medical_procedures TEXT[],
            address JSONB[] DEFAULT NULL,
            contacts JSONB DEFAULT NULL,
            cost VARCHAR(255)
        );`,
    );
    console.log('tasks created');

    await db.query(
        `CREATE TABLE IF NOT EXISTS user_tasks (
            id SERIAL PRIMARY KEY,
            available BOOLEAN DEFAULT FALSE,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            document_task_id INT REFERENCES tasks(id),
            status VARCHAR(10) CHECK (status IN ('open', 'pending', 'finished')),
            picked_date TIMESTAMP DEFAULT NOW(),
            experience_points INT DEFAULT 0,
            proof_status VARCHAR(12) CHECK (proof_status IN ('not_proofed', 'checking', 'proofed')) DEFAULT 'not_proofed'
        );`,
    );
    console.log('user_tasks created');

    // Insert only tasks without connecting them to any user
    for (const task of tasksData) {
        await db.query(
            `INSERT INTO tasks (id, title, description, required, position, blocks, blocked_by, tags, schedule, proof, documents, links, medical_procedures, address, contacts, cost)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
            [
                task.id,
                task.title,
                task.description,
                task.required,
                task.position,
                task.blocks,
                task.blocked_by,
                task.tags,
                task.schedule,
                task.proof,
                task.documents || null,
                task.links || null,
                task.medical_procedures || null,
                task.address || null,
                task.contacts || null,
                task.cost || null,
            ],
        );
        console.log(`Task ${task.id} inserted`);
    }

    console.log('seeding data complete');
}

export async function GET() {
    try {
        await seedData();
        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Error seeding data', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
