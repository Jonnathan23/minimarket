/**
 * @swagger
 * /api/inventory-movements:
 *   get:
 *     summary: Listar todos los movimientos de inventario
 *     tags: [Movimientos de Inventario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de movimientos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryMovements'
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/inventory-movements/movement/{productId}:
 *   post:
 *     summary: Registrar un movimiento manual de inventario
 *     tags: [Movimientos de Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del producto afectado (Foreign Key)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - im_tipo
 *               - im_cantidad
 *               - im_referencia
 *             properties:
 *               im_tipo:
 *                 type: string
 *                 enum: [ENTRADA, SALIDA]
 *               im_cantidad:
 *                 type: integer
 *                 minimum: 1
 *               im_referencia:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movimiento de inventario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventoryMovements'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
