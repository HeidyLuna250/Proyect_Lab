import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Encabezado from '../navegacion/Encabezado';

const RutaProtegida = () => {
    const usuarioGuardado = localStorage.getItem("usuario-supabase");

    if (!usuarioGuardado) {
        return <Navigate to="/login" replace />;
    }
    
    return (
        <>
            <Encabezado />
            <div className="container mt-4">
                <Outlet />
            </div>
        </>
    );
};

export default RutaProtegida;