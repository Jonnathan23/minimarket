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