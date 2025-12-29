# Minimarket Backend

API REST para el sistema de minimarket.

### Instalación de Bun (Opcional)

[Bun](https://bun.sh) es un runtime de JavaScript rápido y todo-en-uno.

**Windows (PowerShell):**
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Linux / macOS:**
```bash
curl -fsSL https://bun.sh/install | bash
```

## Instalación

1. Clona el repositorio
2. Instala las dependencias:

```bash
bun install
```

## Scripts Disponibles

### Pnpm
| Comando | Descripción |
|---------|-------------|
| `pnpm run dev` | Inicia el servidor en modo desarrollo con hot-reload |
| `pnpm run build` | Compila el proyecto TypeScript |
| `pnpm run test` | Ejecuta los tests con Jest |
| `pnpm run test:coverage` | Ejecuta los tests con reporte de cobertura |

### Bun
| Comando | Descripción |
|---------|-------------|
| `bun dev` | Inicia el servidor en modo desarrollo con hot-reload |
| `bun build` | Compila el proyecto TypeScript |
| `bun test` | Ejecuta los tests con Jest |
| `bun test:coverage` | Ejecuta los tests con reporte de cobertura |

## Desarrollo

Para ejecutar el servidor en modo desarrollo:

### Pnpm
```bash
pnpm run dev:api
```

### Bun
```bash
bun dev:api
```

El servidor estará disponible en `http://localhost:4000` (o el puerto definido en las variables de entorno).

> **Nota:**
> Si no se especifica el :api los scripts de bun y pnpm solo iniciaran el servidor y no permitiran peticiones a la API desde cualquier herramienta como Postman o Insomnia.



## Variables de Entorno

Crea un archivo `.env` basado en `.env.template` con las configuraciones necesarias.

## Documentación

La documentación de la API se encuentra en `http://localhost:4000/docs`.

## Tests

### Configuración Previa

Antes de ejecutar los tests, asegúrate de:

1. **Crear una base de datos de prueba**:
   ```sql
   CREATE DATABASE minimarket_test;
   ```

2. **Configurar las variables de entorno**:
   - Copia el archivo `.env.template` a `.env`
   - Completa la variable `DATABASE_TEST_URL` con la cadena de conexión a tu base de datos de prueba:
     ```env
     DATABASE_TEST_URL=postgresql://usuario:contraseña@localhost:5432/minimarket_test
     ```

3. **Instalar dependencias** (si aún no lo has hecho):
   ```bash
   # Con pnpm
   pnpm install
   
   # Con bun
   bun install
   ```

### Ejecutar Tests

#### Suite Completa con Cobertura

```bash
# Con pnpm
pnpm run test:coverage

# Con bun
bun test:coverage
```

#### Solo Tests (sin cobertura)

```bash
# Con pnpm
pnpm run test

# Con bun
bun test
```


### Resultados de Cobertura

Los tests cubren **13 suites** con **102 casos de prueba** que validan:
- Operaciones CRUD completas
- ✅ Validaciones de entrada (400 Bad Request)
- ✅ Manejo de errores del servidor (500 Internal Server Error)
- ✅ Autenticación y autorización
- ✅ Casos límite y escenarios de error

**Última ejecución:**

| Métrica | Resultado |
|---------|-----------|
| Test Suites | 13/13 passed |
| Tests | 102/102 passed |
| Snapshots | 0 total |
| Tiempo | 24.592s |

### Reporte Detallado

El reporte de cobertura HTML se genera automáticamente en la carpeta `coverage/`. Para visualizarlo:

1. Ejecuta los tests con cobertura (ver comandos arriba)
2. Abre el archivo `coverage/lcov-report/index.html` en tu navegador
3. Navega por los diferentes módulos para ver la cobertura línea por línea

### Módulos Testeados

- **Security**: Autenticación, Roles, Parámetros, UserRoles
- **Clients**: Categorías, Productos
- **Providers**: Proveedores, Compras
- **Logistics**: Movimientos de Inventario, Movimientos de Caja
- **Sales**: Ventas