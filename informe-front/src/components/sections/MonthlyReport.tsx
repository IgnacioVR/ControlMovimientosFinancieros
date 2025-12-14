import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import ReportSection from "./ReportSection";

function MonthlyReport() {
  const [fecha, setFecha] = useState<Date>(new Date());
  const [totalDebito, setTotalDebito] = useState();
  const [totalCredito, setTotalCredito] = useState();
  const [balance, setBalance] = useState();
  console.log(totalDebito, totalCredito, balance);

  const handleGenerarInforme = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const url = new URL(`${import.meta.env.VITE_URL_ENDPOINT}/reports/monthly`);

    const year = fecha.toLocaleDateString("es-ES", { year: "numeric" });
    const month = fecha.toLocaleDateString("es-ES", { month: "numeric" });

    //se debe agregar como parametro ya ques es un get
    url.searchParams.append("anio", year);
    url.searchParams.append("mes", month);

    //peticion
    fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          setTotalCredito(result.total_creditos);
          setTotalDebito(result.total_debitos);
          setBalance(result.balance);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="card-border-style">
      <h2 className="title-style">Informe Mensual</h2>
      <p className="subtitle-style">
        Genera un resumen de movimientos por mes.
      </p>

      {/* Peticion de la fehca para generacion de informe */}
      <form onSubmit={handleGenerarInforme} className="mb-6">
        <div className="mb-4">
          <label className="label-style">Fecha</label>
          <DatePicker
            selected={fecha}
            onChange={(date) => setFecha(date || new Date())}
            locale={es}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="input-style"
          />
        </div>

        <button type="submit" className="button-style">
          Generar Informe
        </button>
      </form>

      {totalCredito || totalDebito ? (
        <>
          {/* Informe Generado */}
          <div className="subtitle-style"></div>
          <ReportSection
            titulo={`Informe creado para el mes de ${fecha.toLocaleDateString(
              "es-ES",
              { month: "long" }
            )} del año ${String(
              fecha.toLocaleDateString("es-ES", { year: "numeric" })
            )}`}
            balance={balance}
            credito={totalCredito}
            debito={totalDebito}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default MonthlyReport;
