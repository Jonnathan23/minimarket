/**
 * @swagger
 * /api/providers/provider:
 *   post:
 *     summary: Crear un nuevo proveedor
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - po_nombre
 *               - po_RUC_NIT
 *               - po_direccion
 *               - po_telefono
 *               - po_correo
 *             properties:
 *               po_nombre:
 *                 type: string
 *               po_RUC_NIT:
 *                 type: string
 *               po_direccion:
 *                 type: string
 *               po_telefono:
 *                 type: string
 *               po_correo:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Proveedor creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Providers'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/providers:
 *   get:
 *     summary: Listar todos los proveedores
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proveedores obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Providers'
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/providers/{providerId}:
 *   get:
 *     summary: Obtener un proveedor por ID
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del proveedor
 *     responses:
 *       200:
 *         description: Detalle del proveedor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Providers'
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error interno del servidor
 *   put:
 *     summary: Actualizar un proveedor por ID
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del proveedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               po_nombre:
 *                 type: string
 *               po_RUC_NIT:
 *                 type: string
 *               po_direccion:
 *                 type: string
 *               po_telefono:
 *                 type: string
 *               po_correo:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Proveedor actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Providers'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error interno del servidor
 *   delete:
 *     summary: Eliminar un proveedor por ID
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del proveedor
 *     responses:
 *       200:
 *         description: Proveedor eliminado correctamente
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error interno del servidor
 */
