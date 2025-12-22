/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - us_username
 *               - us_password_encriptado
 *               - us_nombre_completo
 *             properties:
 *               us_username:
 *                 type: string
 *               us_password_encriptado:
 *                 type: string
 *               us_nombre_completo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error de validación (datos faltantes o inválidos)
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - us_username
 *               - us_password_encriptado
 *             properties:
 *               us_username:
 *                 type: string
 *               us_password_encriptado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, retorna el token JWT
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error interno del servidor
 */
