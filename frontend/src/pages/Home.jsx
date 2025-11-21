import Layout from "../components/Layout";
import MainContent from "../components/MainContent";
import "./css/home.css";

export default function Home() {
  return (
    <Layout pageTitle="Sistema de Gestión" activePage="home">
      <MainContent />
    </Layout>
  );
}