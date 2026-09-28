-- Roles and Permissions
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Audit Logs
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    record_id VARCHAR(100),
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Modules (Updated to track relationships)
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    opening_stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 5,
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('receipt', 'issue', 'return', 'damaged', 'adjustment')),
    quantity INT NOT NULL,
    date DATE NOT NULL,
    remarks TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial RBAC Seed Data
INSERT INTO roles (name, description) VALUES 
('Administrator', 'Full system access'),
('Staff', 'Inventory management access'),
('Viewer', 'Read-only access');

INSERT INTO permissions (name, description) VALUES 
('dashboard.view', 'View dashboard metrics'),
('book.view', 'View books'), ('book.create', 'Add books'), ('book.edit', 'Edit books'), ('book.delete', 'Delete books'),
('transaction.view', 'View transactions'), ('transaction.create', 'Add transactions'), ('transaction.delete', 'Delete transactions'),
('report.view', 'View reports'), ('report.export', 'Export reports'),
('user.view', 'View users'), ('user.create', 'Create users'), ('user.edit', 'Edit users'), ('user.delete', 'Delete users'),
('audit.view', 'View audit logs');

-- Map Administrator (Role 1) to ALL permissions
INSERT INTO role_permissions (role_id, permission_id) SELECT 1, id FROM permissions;

-- Map Staff (Role 2) to specific permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 2, id FROM permissions WHERE name IN ('dashboard.view', 'book.view', 'transaction.view', 'transaction.create', 'report.view');

-- Map Viewer (Role 3) to read-only permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 3, id FROM permissions WHERE name IN ('dashboard.view', 'book.view', 'transaction.view', 'report.view');
