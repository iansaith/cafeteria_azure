const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Conexión a XAMPP (MySQL Local)
const dbLocal = mysql.createPool({
    host: 'localhost',
    user: 'iansaith',
    password: 'Mortadela123*',
    database: 'cafeteria_local'
});

// 2. Conexión a Azure Database for MySQL
const dbAzure = mysql.createPool({
    host: 'tallermq.mysql.database.azure.com',
    user: 'mortadela',
    password: 'Mortadela123456',
    database: 'cafeteria_azure'
});

// 3. Conexión a Supabase (PostgreSQL)
const supabaseUrl = 'https://jeffebuuzrarkdmkjkqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZmZlYnV1enJhcmtkbWtqa3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNjc0OTEsImV4cCI6MjEwNzc0MzQ5MX0.OPojzQ_gUws-iZ0eea-8Q5GpMARCCws2Ssf6F4_whUM';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ENDPOINTS GET (Lectura con manejo completo de errores) ---

app.get('/api/pos-local', (req, res) => {
    dbLocal.query('SELECT * FROM tbl_productos_local', (err, results) => {
        if (err) {
            console.error("Error en GET /api/pos-local:", err);
            return res.status(500).json({ error: err.message, detalle: err });
        }
        res.json(results);
    });
});

app.get('/api/ventas-local', (req, res) => {
    dbLocal.query('SELECT * FROM tbl_ventas_diarias', (err, results) => {
        if (err) {
            console.error("Error en GET /api/ventas-local:", err);
            return res.status(500).json({ error: err.message, detalle: err });
        }
        res.json(results);
    });
});

app.get('/api/clientes-azure', (req, res) => {
    dbAzure.query('SELECT * FROM tbl_aprendices_clientes', (err, results) => {
        if (err) {
            console.error("Error en GET /api/clientes-azure:", err);
            return res.status(500).json({ error: err.message, detalle: err });
        }
        res.json(results);
    });
});

app.get('/api/empleados-azure', (req, res) => {
    dbAzure.query('SELECT * FROM tbl_empleados', (err, results) => {
        if (err) {
            console.error("Error en GET /api/empleados-azure:", err);
            return res.status(500).json({ error: err.message, detalle: err });
        }
        res.json(results);
    });
});

app.get('/api/alertas-supabase', async (req, res) => {
    const { data, error } = await supabase.from('tbl_alertas_inventario').select('*');
    if (error) {
        console.error("Error en GET /api/alertas-supabase:", error);
        return res.status(500).json({ error: error.message, detalle: error });
    }
    res.json(data);
});

app.get('/api/pqr-supabase', async (req, res) => {
    const { data, error } = await supabase.from('tbl_sugerencias_pqr').select('*');
    if (error) {
        console.error("Error en GET /api/pqr-supabase:", error);
        return res.status(500).json({ error: error.message, detalle: error });
    }
    res.json(data);
});


// --- ENDPOINTS POST (Inserciones con manejo completo de errores) ---

app.post('/api/pos-local', (req, res) => {
    const { nombre_producto, stock_actual, precio } = req.body;
    const query = 'INSERT INTO tbl_productos_local (nombre_producto, stock_actual, precio) VALUES (?, ?, ?)';
    
    dbLocal.query(query, [nombre_producto, stock_actual, precio], (err, result) => {
        if (err) {
            console.error("Error en POST /api/pos-local:", err);
            return res.status(500).json({ error: err.message, detalle: err });
        }
        res.json({ message: 'Producto agregado exitosamente', id: result.insertId });
    });
});

app.post('/api/pqr-supabase', async (req, res) => {
    const { tipo, comentario } = req.body;
    const { data, error } = await supabase
        .from('tbl_sugerencias_pqr')
        .insert([{ tipo, comentario }]);
    
    if (error) {
        console.error("Error en POST /api/pqr-supabase:", error);
        return res.status(500).json({ error: error.message, detalle: error });
    }
    res.json({ message: 'PQR registrado exitosamente', data });
});


// Inicio del Servidor
app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});