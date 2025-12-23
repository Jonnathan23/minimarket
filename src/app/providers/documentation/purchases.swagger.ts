/**
 * @swagger
 * /api/purchases:
 *   get:
 *     summary: Listar todas las compras
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de compras obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Purchases'
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/purchases/purchase/{providerId}/product/{productId}:
 *   post:
 *     summary: Registrar una nueva compra
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del proveedor (Foreign Key)
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del producto por defecto para los detalles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pu_fecha
 *               - pu_total
 *               - details
 *             properties:
 *               pu_fecha:
 *                 type: string
 *                 format: date-time
 *               pu_total:
 *                 type: number
 *                 format: float
 *               details:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - pd_cantidad
 *                     - pd_precio_unitario
 *                   properties:
 *                     pd_cantidad:
 *                       type: integer
 *                       minimum: 1
 *                     pd_precio_unitario:
 *                       type: number
 *                       format: float
 *     responses:
 *       201:
 *         description: Compra registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Purchases'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/purchases/{purchaseId}:
 *   get:
 *     summary: Obtener una compra por ID
 *     tags: [Compras]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: purchaseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Detalle de la compra
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Purchases'
 *       404:
 *         description: Compra no encontrada
 *       500:
 *         description: Error interno del servidor
 */
