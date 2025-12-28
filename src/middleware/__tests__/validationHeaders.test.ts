import { Request, Response, NextFunction } from "express";
import { Users } from "../../data/models/security";
import { db } from "../../server";
import { JwtAdapter } from "../../utils";
import { authenticate } from "../validationHeaders";

describe('Validation Headers - authenticate middleware', () => {
    let authToken: string;
    let userId: string;
    let testUser: Users;

    beforeAll(async () => {
        await db.connect();

        const uniqueSuffix = Date.now().toString();
        testUser = await Users.create({
            us_username: `auth_tester_${uniqueSuffix}`,
            us_password_encriptado: 'hashed_password',
            us_nombre_completo: 'Auth Tester',
            us_estado: true
        });
        userId = testUser.us_id;
        authToken = (await JwtAdapter.generateToken({ id: userId }))!;
    });

    afterAll(async () => {
        // Cleanup: delete test user
        if (userId) {
            await Users.destroy({ where: { us_id: userId } });
        }
        await db.disconnect();
    });

    describe('Missing Authorization Header', () => {
        it('should return 401 when authorization header is missing', async () => {
            const req = {
                headers: {}
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'No autorizado' });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('Invalid or Expired Token', () => {
        it('should return 401 when token is invalid', async () => {
            const req = {
                headers: {
                    authorization: 'Bearer invalid_token_string'
                }
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido o expirado' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 401 when token is expired', async () => {
            // Generate an expired token (1 second expiration)
            const expiredToken = await JwtAdapter.generateToken({ id: userId }, '1ms');

            // Wait for token to expire
            await new Promise(resolve => setTimeout(resolve, 100));

            const req = {
                headers: {
                    authorization: `Bearer ${expiredToken}`
                }
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido o expirado' });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('Malformed Token', () => {
        it('should return 401 when token does not contain id field', async () => {
            // Generate token without id field
            const malformedToken = await JwtAdapter.generateToken({ username: 'test' });

            const req = {
                headers: {
                    authorization: `Bearer ${malformedToken}`
                }
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Token malformado' });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('User Not Found', () => {
        it('should return 401 when user does not exist in database', async () => {
            // Generate token with non-existent user id
            const fakeUserId = '00000000-0000-0000-0000-000000000000';
            const tokenWithFakeId = await JwtAdapter.generateToken({ id: fakeUserId });

            const req = {
                headers: {
                    authorization: `Bearer ${tokenWithFakeId}`
                }
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Usuario no encontrado' });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('Successful Authentication', () => {
        it('should call next() and attach user to request when token is valid', async () => {
            const req = {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await authenticate(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.user).toBeDefined();
            expect(req.user.us_id).toBe(userId);
            expect(req.user.us_username).toBe(testUser.us_username);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe('Error Handling in Try-Catch', () => {
        it('should return 401 when an unexpected error occurs during token validation', async () => {
            // Mock JwtAdapter.validateToken to throw an error
            const originalValidateToken = JwtAdapter.validateToken;
            JwtAdapter.validateToken = jest.fn().mockRejectedValue(new Error('Unexpected error'));

            const req = {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            } as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
            expect(next).not.toHaveBeenCalled();

            // Restore original implementation
            JwtAdapter.validateToken = originalValidateToken;
        });
    });
});