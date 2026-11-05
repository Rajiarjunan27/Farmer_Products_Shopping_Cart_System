# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Farmer Products Shopping Cart System

## Project Overview

Farmer Products Shopping Cart System is a full-stack web application
developed using React.js, FastAPI, and PostgreSQL.

The application allows administrators to manage farmer products and
customers to browse products, add items to their cart, and checkout.

## Features

### Admin Portal
- Secure admin login using JWT authentication
- Add, edit, and delete products
- View all products
- Activate and deactivate products
- Update product stock
- Upload product images

### Customer Portal
- View active products
- Search products by name
- Filter products by category
- View product details
- Add products to cart
- Update cart quantity
- Remove products from cart
- View cart total
- Checkout successfully
- View order history

## Technology Stack

### Frontend
- React.js
- JavaScript
- React Hooks
- React Router
- Axios
- CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- JWT Authentication
- Pydantic

### Database
- PostgreSQL

## Project Structure

```text
FarmerProductsShoppingCart/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── products.py
│   │   │   ├── cart.py
│   │   │   └── orders.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── security.py
│   ├── uploads/
│   ├── create_admin.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Prerequisites

Install the following:

- Python 3.10+
- Node.js and npm
- PostgreSQL
- Git

## Database Setup

1. Start PostgreSQL.
2. Create a database:

```sql
CREATE DATABASE farmer_cart;
```

3. Configure the database connection in backend environment variables.
4. Ensure the database tables are created using the project's
   database initialization process.

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure environment variables using `.env.example`.

Create the admin account:

```bash
python create_admin.py
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure frontend environment variables using `.env.example`.

Start the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Application Usage

### Admin

1. Open `/admin/login`.
2. Login using admin credentials.
3. Manage products and inventory.
4. Update stock and product status.

### Customer

1. Open `/products`.
2. Browse and search products.
3. Add products to cart.
4. Update quantities.
5. Proceed to checkout.
6. View order history.

## Business Rules

- Only active products are displayed to customers.
- Cart quantities cannot exceed available stock.
- Product stock cannot become negative.
- Cart grand total is calculated automatically.
- Stock is updated after successful checkout.
- Product forms validate required fields.

## Assumptions

- One administrator manages the product inventory.
- Product images are uploaded and stored locally.
- Customer cart and order data are managed by the backend.
- Checkout updates stock and creates an order.
- Payment gateway integration is not included.
- Orders are created without online payment processing.

## Future Enhancements

- Online payment integration
- Customer registration and login
- Order status management
- Cloud image storage
- Email order notifications

## Database Setup

1. Install PostgreSQL.
2. Create database farmer_cart.
3. Execute backend/database.sql in pgAdmin Query Tool.
4. Configure DATABASE_URL in backend/.env.
5. Start FastAPI server.

## Author

Full Stack Developer Assessment Project
