import MonthlyReport from "../components/sections/MonthlyReport";
import MovementForm from "../components/sections/MovementForm";
import MovementsTable from "../components/sections/MovementsTable";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-black">
            Control de Movimientos Financieros
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus movimientos bancarios y genera informes mensuales
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MovementForm />
          <MonthlyReport />
        </div>

        <MovementsTable />
      </div>
    </div>
  );
}

export default Home;
