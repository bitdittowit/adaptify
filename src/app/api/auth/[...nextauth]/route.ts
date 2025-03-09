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
        async jwt({ token, user, trigger, session }) {
            if (trigger === 'update' && session) {
                // Handle updates from client
                return { ...token, ...session.user };
            }

            if (user?.email) {
                try {
                    const result = await db.query(
                        'SELECT id, sex, country, study_group, experience, level FROM users WHERE email = $1',
                        [user.email],
                    );

                    if (result.rows[0]) {
                        token = {
                            ...token,
                            ...result.rows[0],
                        };
                    }
                } catch (error) {
                    console.error('Error in jwt callback:', error);
                }
            }
            return token;
        },
        async signIn({ user }) {
            if (!user.email) {
                return false;
            }

            try {
                await db.query('BEGIN');

                const result = await db.query('SELECT * FROM users WHERE email = $1', [user.email]);

                if (result.rows.length === 0) {
                    // Create new user
                    const newUser = await db.query(
                        `INSERT INTO users (name, email, image, completed_tasks)
                        VALUES ($1, $2, $3, $4)
                        RETURNING id`,
                        [user.name ?? 'New User', user.email, user.image ?? null, []],
                    );

                    const userId = newUser.rows[0].id;

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
        session({ session, token }) {
            const updatedSession = {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    country: token.country,
                    study_group: token.study_group,
                    sex: token.sex,
                    experience: token.experience,
                    level: token.level,
                },
            };
            return updatedSession;
        },
    },
    pages: {
        signIn: '/login',
    },
});

export { handler as GET, handler as POST };
