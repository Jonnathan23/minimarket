/**
 * @swagger
 * /api/cash-movements:
 *   get:
 *     summary: Listar todos los movimientos de caja
 *     tags: [Caja]
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
 *                 $ref: '#/components/schemas/CashMovements'
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/cash-movements/cash:
 *   post:
 *     summary: Crear un movimiento de caja (Apertura/Arqueo/Cierre)
 *     tags: [Caja]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cm_fecha
 *               - cm_tipo
 *               - cm_monto
 *             properties:
 *               cm_fecha:
 *                 type: string
 *                 format: date-time
 *               cm_tipo:
 *                 type: string
 *                 enum: [APERTURA, ARQUEO, CIERRE]
 *               cm_monto:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Movimiento de caja registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashMovements'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/cash-movements/{cashMovementId}:
 *   get:
 *     summary: Obtener un movimiento de caja por ID
 *     tags: [Caja]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cashMovementId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del movimiento de caja
 *     responses:
 *       200:
 *         description: Detalle del movimiento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashMovements'
 *       404:
 *         description: Movimiento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
