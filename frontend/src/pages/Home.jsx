import CardProducto from "../components/cardproducto";
import CardProveedor from "../components/card";
import Layout from "../components/Layout";
import "./css/home.css";

export default function Home() {
  return (
    <Layout pageTitle="Sistema de Gestión" activePage="home">
      <div className="grid-container">
        <section className="content-card">
          <div className="card-header">
            <div className="card-icon">📦</div>
            <h2 className="card-title">Productos</h2>
          </div>
          <CardProducto />
        </section>

        <section className="content-card">
          <div className="card-header">
            <div className="card-icon">🏢</div>
            <h2 className="card-title">Proveedores</h2>
          </div>
          <CardProveedor />
        </section>
      </div>
    </Layout>
  );
}