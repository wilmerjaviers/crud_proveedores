import React, { useState, useEffect } from 'react';
import Proveedor from './components/Proveedor';
import FormProveedor from './components/FormProveedor';
import Swal from 'sweetalert2';

function App() {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const proveedoresStorage = localStorage.getItem('proveedores');
    if (proveedoresStorage) {
      setProveedores(JSON.parse(proveedoresStorage));
    }
  }, []);

  const agregarProveedor = (proveedor) => {
   
    const nuevoProveedor = {
      ...proveedor,
      id: Date.now() 
    };
    
    const nuevosProveedores = [...proveedores, nuevoProveedor];
    setProveedores(nuevosProveedores);
    localStorage.setItem('proveedores', JSON.stringify(nuevosProveedores));
  };

  const eliminarProveedor = (id, nombre) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al proveedor ${nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const proveedoresFiltrados = proveedores.filter((proveedor) => proveedor.id !== id);
        setProveedores(proveedoresFiltrados);
        localStorage.setItem('proveedores', JSON.stringify(proveedoresFiltrados));
        
        Swal.fire(
          '¡Eliminado!',
          'El proveedor ha sido eliminado.',
          'success'
        );
      }
    });
  };

  const handleEditar = (proveedor) => {
    Swal.fire({
      title: 'Editar Proveedor',
      html: `
        <input type="text" id="nombre" class="swal2-input" value="${proveedor.nombre}" placeholder="Nombre" />
        <input type="text" id="direccion" class="swal2-input" value="${proveedor.direccion}" placeholder="Dirección" />
        <input type="text" id="telefono" class="swal2-input" value="${proveedor.telefono}" placeholder="Teléfono" oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
        <input type="email" id="email" class="swal2-input" value="${proveedor.email}" placeholder="Email" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = document.getElementById('nombre').value;
        const direccion = document.getElementById('direccion').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        
        if (!nombre || !direccion || !telefono || !email) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }
        
        return { nombre, direccion, telefono, email };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { nombre, direccion, telefono, email } = result.value;
        const proveedorActualizado = {
          ...proveedor,
          nombre,
          direccion,
          telefono,
          email,
        };
        const proveedoresActualizados = proveedores.map((p) => {
          if (p.id === proveedorActualizado.id) {
            return proveedorActualizado;
          }
          return p;
        });
        setProveedores(proveedoresActualizados);
        localStorage.setItem('proveedores', JSON.stringify(proveedoresActualizados));
        
        Swal.fire(
          '¡Actualizado!',
          'El proveedor ha sido actualizado correctamente.',
          'success'
        );
      }
    });
  };

  return (
    <div className="container">
      <h1>Proveedores CRUD - Wilmer Sanchez</h1>
      <h1>------------------------------------------ </h1>
      <FormProveedor agregarProveedor={agregarProveedor} />
      {proveedores.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor) => (
              <Proveedor
                key={proveedor.id}
                proveedor={proveedor}
                editarProveedor={handleEditar}
                eliminarProveedor={eliminarProveedor}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info mt-3">
          No hay proveedores registrados. Agrega uno nuevo.
        </div>
      )}
    </div>
  );
}

export default App;