# Minimarket Backend

API REST para el sistema de minimarket.

## Requisitos Previos

### Instalación de Bun

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

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Inicia el servidor en modo desarrollo con hot-reload |
| `bun run build` | Compila el proyecto TypeScript |
| `bun run test` | Ejecuta los tests con Jest |
| `bun run test:coverage` | Ejecuta los tests con reporte de cobertura |

## Desarrollo

Para iniciar el servidor en modo desarrollo:

```bash
bun run dev
```

El servidor estará disponible en `http://localhost:4000` (o el puerto definido en las variables de entorno).

## Variables de Entorno

Crea un archivo `.env` basado en `.env.template` con las configuraciones necesarias.
