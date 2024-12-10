import { NextResponse } from 'next/server';
import { DEFAULT_USER } from '@/app/constants/user';
import tasksData from '@/app/constants/tasks/user_tasks.json';
import { db } from '@vercel/postgres';

const client = db;

async function seedData() {
  console.log('start to seed data');

  await client.query(`DROP TABLE IF EXISTS user_tasks`);
  console.log('user_tasks dropped');
  await client.query(`DROP TABLE IF EXISTS tasks`);
  console.log('tasks dropped');
  await client.query(`DROP TABLE IF EXISTS users`);
  console.log('users dropped');

  await client.query(
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      sex VARCHAR(6) CHECK(sex IN ('male', 'female')),
      country VARCHAR(255),
      arrival_date TIMESTAMP DEFAULT NULL,
      study_group VARCHAR(255),
      experience INT DEFAULT 0,
      level INT DEFAULT 1
    );`
  );
  console.log('users created');
  
  await client.query(
    `CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      required BOOLEAN DEFAULT FALSE,
      position INT,
      blocking_tasks INTEGER[],
      tags TEXT[]
    );`
  );
  console.log('tasks created');

  await client.query(
    `CREATE TABLE IF NOT EXISTS user_tasks (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      document_task_id INT REFERENCES tasks(id),
      status VARCHAR(10) CHECK (status IN ('open', 'pending', 'finished')),
      picked_date TIMESTAMP DEFAULT NOW(),
      experience_points INT DEFAULT 0
    );`
  );
  console.log('user_tasks created');

  await client.query(
    `INSERT INTO users (name, sex, country, study_group, experience, level)
    VALUES ($1, $2, $3, $4, $5, $6);`
  , [
    DEFAULT_USER.name,
    DEFAULT_USER.sex,
    DEFAULT_USER.country,
    DEFAULT_USER.study_group,
    DEFAULT_USER.experience,
    DEFAULT_USER.level,
  ]);
  console.log('user inserted');

  for (const task of tasksData.tasks) {
    const result = await client.query(
      `INSERT INTO tasks (title, description, required, position, blocking_tasks, tags)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;`
    , [
      task.title,
      task.description,
      task.required,
      task.position,
      task.blocking_tasks,
      task.tags
    ]);
    console.log('task inserted', task);

    const documentTaskId = result.rows[0]?.id;
    console.log('documentTaskId', documentTaskId)

    if (documentTaskId) {
      await client.query(
        `INSERT INTO user_tasks (user_id, document_task_id, status, experience_points)
        VALUES ((SELECT id FROM users WHERE name = $1), $2, 'open', 200);`
      , [
        DEFAULT_USER.name,
        documentTaskId
      ]);
      console.log('user_task inserted')
    }
  }

  console.log('seeding data complete');
}

export async function GET() {
  try {
    await seedData();
    console.log('seed data ended');
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('error', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
