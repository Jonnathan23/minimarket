/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Listar todas las ventas
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ventas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sales'
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/sales/sale/{clientId}/product/{productId}:
 *   post:
 *     summary: Registrar una nueva venta
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del cliente (Foreign Key)
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
 *               - sa_fecha
 *               - sa_total
 *               - sa_medio_de_pago
 *               - details
 *             properties:
 *               sa_fecha:
 *                 type: string
 *                 format: date-time
 *               sa_total:
 *                 type: number
 *                 format: float
 *               sa_medio_de_pago:
 *                 type: string
 *               details:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - sd_cantidad
 *                     - sd_precio_unitario
 *                   properties:
 *                     sd_cantidad:
 *                       type: integer
 *                       minimum: 1
 *                     sd_precio_unitario:
 *                       type: number
 *                       format: float
 *     responses:
 *       201:
 *         description: Venta registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sales'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/sales/{saleId}:
 *   get:
 *     summary: Obtener una venta por ID
 *     tags: [Ventas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: saleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Detalle de la venta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sales'
 *       404:
 *         description: Venta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
