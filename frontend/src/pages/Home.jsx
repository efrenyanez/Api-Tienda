import SlideBar from "../components/sliderbar";
import CardProducto from "../components/cardproducto"; // 🔹 Importa el componente de productos
import CardProveedor from "../components/card"; // 🔹 Este es el de proveedores
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SlideBar />

      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Productos y Proveedores
        </h1>

        {/* 🔹 Contenedor lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardProducto />  {/* 🧩 Productos */}
          <CardProveedor /> {/* 🧩 Proveedores */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
