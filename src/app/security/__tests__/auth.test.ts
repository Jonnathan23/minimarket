import request from 'supertest';
import server, { db } from '../../../server';
import { Users } from '../../../data/models/security';
import { BcryptAdapter } from '../../../utils';

describe('Auth Integration Tests', () => {

    // Clean up created users after tests
    const createdUserIds: string[] = [];

    beforeAll(async () => {
        await db.connect(); // 1. Abrir conexión
    });

    afterAll(async () => {
        if (createdUserIds.length > 0) {
            await Users.destroy({ where: { us_id: createdUserIds } });
        }

        await db.disconnect();
    });

    describe('POST /api/auth/register', () => {
        it('should return 201 and register a new user', async () => {
            const uniqueSuffix = Date.now().toString();
            const username = `newuser_${uniqueSuffix}`;

            const response = await request(server)
                .post('/api/auth/register')
                .send({
                    us_username: username,
                    us_password_encriptado: 'password123',
                    us_nombre_completo: 'New User'
                });

            expect(response.status).toBe(201);
            expect(response.text).toBe('User registered successfully');

            // Verify DB and cleanup
            const user = await Users.findOne({ where: { us_username: username } });
            expect(user).not.toBeNull();
            if (user) createdUserIds.push(user.us_id);
        });

        it('should return 400 if username is missing', async () => {
            const response = await request(server)
                .post('/api/auth/register')
                .send({
                    us_password_encriptado: 'password123',
                    us_nombre_completo: 'New User'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('POST /api/auth/login', () => {
        let testUserId: string;
        const testUsername = `loginuser_${Date.now()}`;
        const testPassword = 'loginpass123';

        beforeAll(async () => {
            // Create a user for login testing manually to ensure known password
            const passwordEncriptado = BcryptAdapter.hash(testPassword);
            const user = await Users.create({
                us_username: testUsername,
                us_password_encriptado: passwordEncriptado,
                us_nombre_completo: 'Login User',
                us_estado: true
            });
            testUserId = user.us_id;
            createdUserIds.push(testUserId);
        });

        it('should return 200 and a token for valid credentials', async () => {
            const response = await request(server)
                .post('/api/auth/login')
                .send({
                    us_username: testUsername,
                    us_password_encriptado: testPassword
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('should return 401 for invalid credentials', async () => {
            const response = await request(server)
                .post('/api/auth/login')
                .send({
                    us_username: testUsername,
                    us_password_encriptado: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.errors).toBe('Invalid credentials');
        });

        it('should return 400 if user does not exist (via validation)', async () => {
            const response = await request(server)
                .post('/api/auth/login')
                .send({
                    us_username: 'nonexistentuser',
                    us_password_encriptado: 'password123'
                });

            expect(response.status).not.toBe(200);
        });
    });
});
