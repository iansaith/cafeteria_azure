import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [pqrs, setPqrs] = useState([]);

  const [nuevoProducto, setNuevoProducto] = useState({ nombre_producto: '', stock_actual: '', precio: '' });
  const [nuevoPqr, setNuevoPqr] = useState({ tipo: 'Sugerencia', comentario: '' });

  // Estado para controlar cuáles tarjetas están desplegadas
  const [desplegados, setDesplegados] = useState({
    productos: true,
    ventas: true,
    clientes: false,
    empleados: false,
    alertas: true,
    pqrs: false
  });

  const toggleDesplegar = (seccion) => {
    setDesplegados(prev => ({
      ...prev,
      [seccion]: !prev[seccion]
    }));
  };

  const cargarDatos = () => {
    axios.get('http://130.213.41.197:3001/api/pos-local')
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));

    axios.get('http://130.213.41.197:3001/api/ventas-local')
      .then(res => setVentas(res.data))
      .catch(err => console.error(err));

    axios.get('http://130.213.41.197:3001/api/clientes-azure')
      .then(res => setClientes(res.data))
      .catch(err => console.error(err));

    axios.get('http://130.213.41.197:3001/api/empleados-azure')
      .then(res => setEmpleados(res.data))
      .catch(err => console.error(err));

    axios.get('http://130.213.41.197:3001/api/alertas-supabase')
      .then(res => setAlertas(res.data))
      .catch(err => console.error(err));

    axios.get('http://130.213.41.197:3001/api/pqr-supabase')
      .then(res => setPqrs(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleGuardarProducto = (e) => {
    e.preventDefault();
    axios.post('http://130.213.41.197:3001/api/pos-local', nuevoProducto)
      .then(() => {
        alert('Producto agregado correctamente');
        setNuevoProducto({ nombre_producto: '', stock_actual: '', precio: '' });
        cargarDatos();
      })
      .catch(err => console.error(err));
  };

  const handleGuardarPqr = (e) => {
    e.preventDefault();
    axios.post('http://130.213.41.197:3001/api/pqr-supabase', nuevoPqr)
      .then(() => {
        alert('PQR enviado correctamente');
        setNuevoPqr({ tipo: 'Sugerencia', comentario: '' });
        cargarDatos();
      })
      .catch(err => console.error(err));
  };

  // Estilos compartidos
  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '16px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
  };

  const tableHeaderStyle = {
    textAlign: 'left',
    padding: '8px 12px',
    borderBottom: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#475569',
    fontSize: '0.85rem',
    fontWeight: '600'
  };

  const tableTdStyle = {
    padding: '8px 12px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '0.9rem',
    color: '#334155'
  };

  const inputStyle = {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '0.9rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  };

  const headerToggleStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none'
  };

  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '30px 20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      
      {/* Encabezado Principal */}
      <header style={{ maxWidth: '1400px', margin: '0 auto 30px auto', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1.8rem', fontWeight: '700' }}>
          Dashboard Cafetería SENA
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
          Gestión unificada de ventas, clientes, empleados y solicitudes
        </p>
      </header>

      {/* Contenedor Principal de 2 Columnas */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* COLUMNA IZQUIERDA: TABLAS / REPORTES DESPLEGABLES */}
        <div style={{ flex: '2', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 1. Productos POS */}
          <div style={cardStyle}>
            <div style={headerToggleStyle} onClick={() => toggleDesplegar('productos')}>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.05rem', fontWeight: '600' }}>
                1. Productos POS (XAMPP)
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#007bff', fontWeight: 'bold' }}>
                {desplegados.productos ? '[Ocultar]' : '[Mostrar]'}
              </span>
            </div>
            
            {desplegados.productos && (
              <div style={{ overflowX: 'auto', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Producto</th>
                      <th style={tableHeaderStyle}>Stock</th>
                      <th style={tableHeaderStyle}>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map(p => (
                      <tr key={p.id_producto || p.id}>
                        <td style={tableTdStyle}>{p.nombre_producto}</td>
                        <td style={tableTdStyle}>{p.stock_actual}</td>
                        <td style={tableTdStyle}>${p.precio}</td>
                      </tr>
                    ))}
                    {productos.length === 0 && (
                      <tr><td colSpan="3" style={{ ...tableTdStyle, textAlign: 'center', color: '#94a3b8' }}>Sin datos registrados</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 2. Ventas Diarias */}
          <div style={cardStyle}>
            <div style={headerToggleStyle} onClick={() => toggleDesplegar('ventas')}>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.05rem', fontWeight: '600' }}>
                2. Ventas Diarias (XAMPP)
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#007bff', fontWeight: 'bold' }}>
                {desplegados.ventas ? '[Ocultar]' : '[Mostrar]'}
              </span>
            </div>

            {desplegados.ventas && (
              <div style={{ overflowX: 'auto', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>ID Venta</th>
                      <th style={tableHeaderStyle}>Cantidad Vendida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map(v => (
                      <tr key={v.id_venta || v.id}>
                        <td style={tableTdStyle}>#{v.id_venta || v.id}</td>
                        <td style={tableTdStyle}>{v.cantidad_vendida} ud.</td>
                      </tr>
                    ))}
                    {ventas.length === 0 && (
                      <tr><td colSpan="2" style={{ ...tableTdStyle, textAlign: 'center', color: '#94a3b8' }}>Sin ventas registradas</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 3. Clientes SENA */}
          <div style={cardStyle}>
            <div style={headerToggleStyle} onClick={() => toggleDesplegar('clientes')}>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.05rem', fontWeight: '600' }}>
                3. Clientes SENA (Azure)
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#007bff', fontWeight: 'bold' }}>
                {desplegados.clientes ? '[Ocultar]' : '[Mostrar]'}
              </span>
            </div>

            {desplegados.clientes && (
              <div style={{ overflowX: 'auto', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Nombre</th>
                      <th style={tableHeaderStyle}>Programa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map(c => (
                      <tr key={c.id_aprendiz || c.id}>
                        <td style={tableTdStyle}>{c.nombres}</td>
                        <td style={tableTdStyle}>{c.programa_formacion}</td>
                      </tr>
                    ))}
                    {clientes.length === 0 && (
                      <tr><td colSpan="2" style={{ ...tableTdStyle, textAlign: 'center', color: '#94a3b8' }}>Sin clientes registrados</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 4. Empleados */}
          <div style={cardStyle}>
            <div style={headerToggleStyle} onClick={() => toggleDesplegar('empleados')}>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.05rem', fontWeight: '600' }}>
                4. Empleados (Azure)
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#007bff', fontWeight: 'bold' }}>
                {desplegados.empleados ? '[Ocultar]' : '[Mostrar]'}
              </span>
            </div>

            {desplegados.empleados && (
              <div style={{ overflowX: 'auto', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Nombre</th>
                      <th style={tableHeaderStyle}>Turno / Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleados.map(e => (
                      <tr key={e.id_empleado || e.id}>
                        <td style={tableTdStyle}>{e.nombre}</td>
                        <td style={tableTdStyle}>{e.turno} ({e.rol})</td>
                      </tr>
                    ))}
                    {empleados.length === 0 && (
                      <tr><td colSpan="2" style={{ ...tableTdStyle, textAlign: 'center', color: '#94a3b8' }}>Sin empleados registrados</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 5. Alertas Inventario */}
          <div style={cardStyle}>
            <div style={headerToggleStyle} onClick={() => toggleDesplegar('alertas')}>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.05rem', fontWeight: '600' }}>
                5. Alertas Inventario (Supabase)
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#dc3545', fontWeight: 'bold' }}>
                {desplegados.alertas ? '[Ocultar]' : '[Mostrar]'}
              </span>
            </div>

            {desplegados.alertas && (
              <div style={{ overflowX: 'auto', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Mensaje</th>
                      <th style={tableHeaderStyle}>Criticidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertas.map(a => (
                      <tr key={a.id_alerta || a.id}>
                        <td style={tableTdStyle}>{a.mensaje_alerta}</td>
                        <td style={tableTdStyle}>
                          <span style={{ 
                            padding: '2px 8px', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem', 
                            backgroundColor: a.criticidad?.toLowerCase() === 'alta' ? '#fee2e2' : '#fef3c7',
                            color: a.criticidad?.toLowerCase() === 'alta' ? '#991b1b' : '#92400e',
                            fontWeight: '600'
                          }}>
                            {a.criticidad}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {alertas.length === 0 && (
                      <tr><td colSpan="2" style={{ ...tableTdStyle, textAlign: 'center', color: '#94a3b8' }}>Sin alertas actuales</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 6. PQRs Registradas */}
          <div style={cardStyle}>
            <div style={headerToggleStyle} onClick={() => toggleDesplegar('pqrs')}>
              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.05rem', fontWeight: '600' }}>
                6. PQRs Registradas (Supabase)
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#28a745', fontWeight: 'bold' }}>
                {desplegados.pqrs ? '[Ocultar]' : '[Mostrar]'}
              </span>
            </div>

            {desplegados.pqrs && (
              <div style={{ overflowX: 'auto', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Tipo</th>
                      <th style={tableHeaderStyle}>Comentario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pqrs.map(q => (
                      <tr key={q.id_pqr || q.id}>
                        <td style={{ ...tableTdStyle, fontWeight: '600' }}>{q.tipo}</td>
                        <td style={tableTdStyle}>{q.comentario}</td>
                      </tr>
                    ))}
                    {pqrs.length === 0 && (
                      <tr><td colSpan="2" style={{ ...tableTdStyle, textAlign: 'center', color: '#94a3b8' }}>Sin PQRs registradas</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* COLUMNA DERECHA: FORMULARIOS DE REGISTRO */}
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Formulario Agregar Producto */}
          <div style={{ ...cardStyle, borderTop: '4px solid #007bff' }}>
            <h3 style={{ marginTop: 0, color: '#007bff', fontSize: '1.1rem', marginBottom: '4px' }}>
              Agregar Nuevo Producto
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '15px' }}>
              Base de Datos: XAMPP Local
            </span>
            
            <form onSubmit={handleGuardarProducto} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '500' }}>Nombre del Producto</label>
                <input 
                  type="text" 
                  placeholder="Ej. Café Americano" 
                  value={nuevoProducto.nombre_producto} 
                  onChange={e => setNuevoProducto({...nuevoProducto, nombre_producto: e.target.value})} 
                  required 
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '500' }}>Stock Inicial</label>
                <input 
                  type="number" 
                  placeholder="Ej. 50" 
                  value={nuevoProducto.stock_actual} 
                  onChange={e => setNuevoProducto({...nuevoProducto, stock_actual: e.target.value})} 
                  required 
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '500' }}>Precio Unitario</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="Ej. 2500" 
                  value={nuevoProducto.precio} 
                  onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})} 
                  required 
                  style={inputStyle}
                />
              </div>

              <button 
                type="submit" 
                style={{ 
                  marginTop: '10px', 
                  padding: '10px', 
                  backgroundColor: '#007bff', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '6px', 
                  fontWeight: '600', 
                  cursor: 'pointer'
                }}
              >
                Guardar Producto
              </button>
            </form>
          </div>

          {/* Formulario Registrar PQR */}
          <div style={{ ...cardStyle, borderTop: '4px solid #28a745' }}>
            <h3 style={{ marginTop: 0, color: '#28a745', fontSize: '1.1rem', marginBottom: '4px' }}>
              Registrar PQR / Sugerencia
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '15px' }}>
              Base de Datos: Supabase
            </span>

            <form onSubmit={handleGuardarPqr} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '500' }}>Tipo de Solicitud</label>
                <select 
                  value={nuevoPqr.tipo} 
                  onChange={e => setNuevoPqr({...nuevoPqr, tipo: e.target.value})}
                  style={{ ...inputStyle, backgroundColor: '#fff' }}
                >
                  <option value="Sugerencia">Sugerencia</option>
                  <option value="Queja">Queja</option>
                  <option value="Reclamo">Reclamo</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '4px', fontWeight: '500' }}>Comentario</label>
                <textarea 
                  placeholder="Escribe los detalles aquí..." 
                  value={nuevoPqr.comentario} 
                  onChange={e => setNuevoPqr({...nuevoPqr, comentario: e.target.value})} 
                  required 
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <button 
                type="submit" 
                style={{ 
                  marginTop: '10px', 
                  padding: '10px', 
                  backgroundColor: '#28a745', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '6px', 
                  fontWeight: '600', 
                  cursor: 'pointer'
                }}
              >
                Enviar PQR
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;