import { NextResponse } from 'next/server';

import { db } from '@vercel/postgres';

import rawTasksData from '@/constants/tasks/user_tasks.json';
import type { BaseTask, LocalizedText } from '@/types';

type RawText = string | LocalizedText;

// Ensure all text fields are in LocalizedText format
const ensureLocalizedText = (text: RawText | null | undefined): LocalizedText | null => {
    if (!text) {
        return null;
    }
    if (typeof text === 'string') {
        return { ru: text, en: text };
    }
    return text;
};

async function dropTables() {
    await db.query('DROP TABLE IF EXISTS user_tasks');
    console.log('user_tasks dropped');
    await db.query('DROP TABLE IF EXISTS tasks');
    console.log('tasks dropped');
    await db.query('DROP TABLE IF EXISTS users');
    console.log('users dropped');
}

async function createUsersTable() {
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
}

async function createTasksTable() {
    await db.query(
        `CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY,
            title JSONB NOT NULL DEFAULT '{"ru": ""}',
            description JSONB NOT NULL DEFAULT '{"ru": ""}',
            required BOOLEAN DEFAULT FALSE,
            position INT,
            blocks INTEGER[],
            blocked_by INTEGER[],
            tags TEXT[],
            schedule JSONB,
            proof JSONB,
            documents JSONB DEFAULT NULL,
            links JSONB DEFAULT NULL,
            medical_procedures JSONB DEFAULT NULL,
            address JSONB DEFAULT NULL,
            contacts JSONB DEFAULT NULL,
            cost JSONB DEFAULT NULL,
            clubs JSONB DEFAULT NULL,
            priority INT CHECK (priority BETWEEN 1 AND 5),
            deadline_days INT DEFAULT NULL,
            duration_minutes INT NOT NULL DEFAULT 60
        );`,
    );
    console.log('tasks created');
}

async function createUserTasksTable() {
    await db.query(
        `CREATE TABLE IF NOT EXISTS user_tasks (
            id SERIAL PRIMARY KEY,
            available BOOLEAN DEFAULT FALSE,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            document_task_id INT REFERENCES tasks(id),
            status VARCHAR(10) CHECK (status IN ('open', 'pending', 'finished')),
            picked_date TIMESTAMP DEFAULT NULL,
            experience_points INT DEFAULT 0,
            proof_status VARCHAR(12) CHECK (proof_status IN ('not_proofed', 'checking', 'proofed')) DEFAULT 'not_proofed'
        );`,
    );
    console.log('user_tasks created');
}

async function insertTask(task: BaseTask) {
    const {
        id,
        title,
        description,
        required,
        position,
        blocks,
        blocked_by,
        tags,
        schedule,
        proof,
        documents,
        links,
        medical_procedures,
        address,
        contacts,
        cost,
        clubs,
    } = task;

    const query = `
        INSERT INTO tasks (
            id, title, description, required, position, blocks, blocked_by, tags, 
            schedule, proof, documents, links, medical_procedures, address, contacts, cost, clubs
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    `;

    const values = [
        id,
        JSON.stringify(ensureLocalizedText(title)),
        JSON.stringify(ensureLocalizedText(description)),
        required,
        position,
        blocks || [],
        blocked_by || [],
        tags || [],
        schedule ? JSON.stringify(schedule) : null,
        proof ? JSON.stringify(proof) : null,
        documents
            ? JSON.stringify({
                  items: documents.map(doc => ensureLocalizedText(doc)),
              })
            : null,
        links
            ? JSON.stringify({
                  items: links.map(link => ({
                      url: link.url,
                      description: ensureLocalizedText(link.description),
                  })),
              })
            : null,
        medical_procedures
            ? JSON.stringify({
                  items: medical_procedures.map(proc => ensureLocalizedText(proc)),
              })
            : null,
        address
            ? JSON.stringify({
                  items: address.map(addr => ({
                      title: ensureLocalizedText(addr.title),
                      value: ensureLocalizedText(addr.value),
                  })),
              })
            : null,
        contacts
            ? JSON.stringify({
                  phones:
                      contacts.phones?.map(phone => ({
                          title: ensureLocalizedText(phone.title),
                          value: phone.value,
                      })) || [],
                  emails:
                      contacts.emails?.map(email => ({
                          title: ensureLocalizedText(email.title),
                          value: email.value,
                      })) || [],
              })
            : null,
        cost ? JSON.stringify(ensureLocalizedText(cost)) : null,
        clubs ? JSON.stringify({ items: clubs.map(club => ensureLocalizedText(club)) }) : null,
    ];

    try {
        await db.query(query, values);
        console.log(`Task ${id} inserted`);
    } catch (error) {
        console.error(`Error inserting task ${id}:`, error);
        throw error;
    }
}

async function seedData() {
    console.log('start to seed data');

    await dropTables();
    await createUsersTable();
    await createTasksTable();
    await createUserTasksTable();

    // Insert tasks
    for (const task of rawTasksData.tasks) {
        await insertTask(task as BaseTask);
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
