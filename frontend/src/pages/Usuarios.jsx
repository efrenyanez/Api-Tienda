import Layout from "../components/Layout";
import TablaUsuarios from "../components/Usuarios.jsx";

export default function Usuarios() {
  return (
    <Layout pageTitle="Usuarios" activePage="usuarios">
      <TablaUsuarios />
    </Layout>
  );
}