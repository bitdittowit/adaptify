import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { db } from '@vercel/postgres';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) {
                return false;
            }

            try {
                await db.query('BEGIN');

                const result = await db.query('SELECT * FROM users WHERE email = $1', [user.email]);

                let userId: number;

                if (result.rows.length === 0) {
                    // Create new user
                    const newUser = await db.query(
                        `INSERT INTO users (name, email, image, sex, country, study_group, experience, level, completed_tasks)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                        RETURNING id`,
                        [
                            user.name ?? 'New User',
                            user.email,
                            user.image ?? null,
                            'male', // default values
                            'ru',
                            'КИ21-22Б',
                            0,
                            1,
                            [],
                        ],
                    );

                    userId = newUser.rows[0].id;

                    // Create user tasks for the new user
                    const tasks = await db.query('SELECT * FROM tasks');
                    for (const task of tasks.rows) {
                        await db.query(
                            `INSERT INTO user_tasks (user_id, document_task_id, status, experience_points, proof_status, available)
                            VALUES ($1, $2, 'open', 200, 'not_proofed', $3)`,
                            [userId, task.id, task.blocked_by.length === 0],
                        );
                    }
                } else {
                    // Update existing user's name and image
                    await db.query(
                        `UPDATE users 
                        SET name = $1, image = $2
                        WHERE email = $3`,
                        [user.name, user.image, user.email],
                    );
                }

                await db.query('COMMIT');
                return true;
            } catch (error) {
                await db.query('ROLLBACK');
                console.error('Error in signIn callback:', error);
                return false;
            }
        },
        async session({ session }) {
            if (session.user?.email) {
                try {
                    const result = await db.query(
                        'SELECT id, sex, country, study_group, experience, level FROM users WHERE email = $1',
                        [session.user.email],
                    );

                    if (result.rows[0]) {
                        session.user = {
                            ...session.user,
                            ...result.rows[0],
                        };
                    }
                } catch (error) {
                    console.error('Error in session callback:', error);
                }
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
});

export { handler as GET, handler as POST };
