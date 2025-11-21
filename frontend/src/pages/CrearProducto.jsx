import React from "react";
import Layout from "../components/Layout";
import FormularioProducto from "../components/FormularioProducto";

export default function CrearProducto() {
  return (
    <Layout pageTitle="Crear Producto" activePage="producto">
      <FormularioProducto />
    </Layout>
  );
}