/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Listar todos los roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Roles'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *   post:
 *     summary: Crear un nuevo rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ro_nombre_del_rol
 *             properties:
 *               ro_nombre_del_rol:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Roles'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/roles/{ro_id}:
 *   get:
 *     summary: Obtener un rol por ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ro_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del rol
 *     responses:
 *       200:
 *         description: Detalle del rol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Roles'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error interno del servidor
 *   put:
 *     summary: Actualizar un rol por ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ro_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ro_nombre_del_rol:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Roles'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error interno del servidor
 *   delete:
 *     summary: Eliminar un rol por ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ro_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del rol
 *     responses:
 *       200:
 *         description: Rol eliminado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/parameters:
 *   get:
 *     summary: Listar todos los parámetros
 *     tags: [Parámetros del Sistema]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de parámetros obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Parameters'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *   post:
 *     summary: Crear un nuevo parámetro
 *     tags: [Parámetros del Sistema]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pa_clave
 *               - pa_valor
 *             properties:
 *               pa_clave:
 *                 type: string
 *               pa_valor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Parámetro creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parameters'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/parameters/{parameterId}:
 *   get:
 *     summary: Obtener un parámetro por ID
 *     tags: [Parámetros del Sistema]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: parameterId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del parámetro
 *     responses:
 *       200:
 *         description: Detalle del parámetro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parameters'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Parámetro no encontrado
 *       500:
 *         description: Error interno del servidor
 *   put:
 *     summary: Actualizar un parámetro por ID
 *     tags: [Parámetros del Sistema]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: parameterId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del parámetro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pa_clave:
 *                 type: string
 *               pa_valor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Parámetro actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Parameters'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Parámetro no encontrado
 *       500:
 *         description: Error interno del servidor
 *   delete:
 *     summary: Eliminar un parámetro por ID
 *     tags: [Parámetros del Sistema]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: parameterId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del parámetro
 *     responses:
 *       200:
 *         description: Parámetro eliminado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Parámetro no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/user-roles/assign/{userId}/{roleId}:
 *   post:
 *     summary: Asignar un rol a un usuario
 *     tags: [Asignación de Accesos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del rol
 *     responses:
 *       201:
 *         description: Rol asignado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoles'
 *       400:
 *         description: Error de validación o asignación fallida
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario o rol no encontrado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/user-roles/user-roles/remove/{userId}/{roleId}:
 *   delete:
 *     summary: Remover un rol de un usuario
 *     tags: [Asignación de Accesos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol removido correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario o rol no encontrado o no asociado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/user-roles/user-roles/list/{userId}:
 *   get:
 *     summary: Listar roles de un usuario
 *     tags: [Asignación de Accesos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de roles del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserRoles'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
