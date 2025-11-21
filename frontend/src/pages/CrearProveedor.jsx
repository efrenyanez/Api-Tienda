import React from "react";
import Layout from "../components/Layout";
import FormularioProveedor from "../components/FormularioProveedor";

export default function CrearProveedor() {
  return (
    <Layout pageTitle="Crear Proveedor" activePage="proveedor">
      <FormularioProveedor />
    </Layout>
  );
}