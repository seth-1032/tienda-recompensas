# Tienda de Recompensas

Aplicación web de comercio electrónico que permite consultar productos, filtrarlos por categoría, gestionar un carrito de compras y acumular puntos mediante reglas de recompensa.

## Tecnologías

- **Frontend:** React, TypeScript y Vite.
- **Backend:** Node.js, Express y TypeScript.
- **ORM:** Prisma 7.
- **Base de datos:** SQLite.
- **Estilos:** CSS.

## Requisitos

- Node.js y npm, en versiones compatibles con las dependencias del proyecto.
- Git.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/seth-1032/tienda-recompensas
cd tienda-recompensas
```

### 2. Configurar el backend

```bash
cd backend
npm ci
```

Crear un archivo `.env` dentro de `backend` con la siguiente variable:

```env
DATABASE_URL="file:./dev.db"
```

Generar el cliente de Prisma:

```bash
npx prisma generate
```

Crear y aplicar las migraciones:

```bash
npx prisma migrate dev
```

Cargar los datos iniciales:

```bash
npx prisma db seed
```

Iniciar el servidor:

```bash
npm run dev
```

El backend estará disponible en `http://localhost:3000`.

### 3. Configurar el frontend

En otra terminal:

```bash
cd frontend
npm ci
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

## Estructura del proyecto

```text
tienda-recompensas/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── routes/
│       └── services/
├── frontend/
│   └── src/
│       ├── components/
│       ├── services/
│       ├── types/
│       └── App.tsx
├── README.md
```

## Decisiones de arquitectura

- Separación entre frontend y backend mediante una API REST.
- Organización del backend en rutas, controladores y servicios.
- Prisma para la comunicación con la base de datos.
- Paginación, búsqueda y filtrado por categoría procesados desde el backend.
- Validaciones de stock y reglas de puntos centralizadas en el backend.
- Componentes reutilizables en React y estilos CSS.

## Reglas de puntos

Las reglas de recompensa implementadas son:

| Acción | Puntos |
|---|---:|
| Agregar un producto nuevo al carrito | +5 |
| Aumentar la cantidad de un producto existente | 0 |
| Modificar la cantidad de un producto | 0 |
| Eliminar un producto del carrito | -5 |

El cálculo de puntos se realiza exclusivamente en el backend.

## Supuestos y consideraciones

- Se utiliza un usuario de demostración con ID `1`.
- No se implementó autenticación, ya que no forma parte del alcance principal del ejercicio.
- Los puntos se generan al agregar productos al carrito, no al completar una compra.
- La eliminación de un producto descuenta puntos sin permitir que el saldo sea negativo.
- No se permite agregar cantidades superiores al stock disponible.
- El seed permite cargar categorías, productos y el usuario inicial para realizar pruebas.

## Consideraciones adicionales

- El archivo `.env` y la base de datos local no deben subirse al repositorio.
- Después de instalar las dependencias, es necesario ejecutar `npx prisma generate` para generar el cliente de Prisma.
- Si `better-sqlite3` necesita compilarse durante la instalación, Windows puede requerir Python y las herramientas de compilación de Visual Studio.
- Para aplicar migraciones existentes en un entorno de despliegue, utilizar `npx prisma migrate deploy` en lugar de `migrate dev`.