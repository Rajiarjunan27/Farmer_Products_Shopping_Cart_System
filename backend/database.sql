
-- Farmer Products Shopping Cart System
-- PostgreSQL Database

CREATE DATABASE farmer_cart;

-- Connect to farmer_cart before running remaining statements.

-- 1. Admin Table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. Customer Table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    farmer_name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    available_quantity INTEGER NOT NULL DEFAULT 0
        CHECK (available_quantity >= 0),
    image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 4. Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    customer_id INTEGER NOT NULL REFERENCES customers(id)
        ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    UNIQUE (customer_id, product_id)
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'Placed',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id)
        ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    product_name VARCHAR(150) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal NUMERIC(10,2) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category
ON products(category);

CREATE INDEX IF NOT EXISTS idx_products_active
ON products(is_active);

CREATE INDEX IF NOT EXISTS idx_cart_customer
ON cart_items(customer_id);

CREATE INDEX IF NOT EXISTS idx_orders_customer
ON orders(customer_id);
