import { useEffect, useState } from "react";
import Badge from "../badges/Badge";
import type { Movement } from "../../types/interface";

function MovementsTable() {
  const [movimientos, setMovimientos] = useState<Movement[]>([]);
  const [error, setError] = useState<String>("");

  useEffect(() => {
    //preparacion de la URL
    const url = new URL(`${import.meta.env.VITE_URL_ENDPOINT}/movements`);

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
          //Parsear los resultados
          const movimientosParseados = result.map((mov: any) => ({
            ...mov,
            monto: Number(mov.monto),
            fecha: new Date(mov.fecha),
          }));
          //Todo salio bien y se setea
          setMovimientos(movimientosParseados);
        }
      })
      .catch((error) => {
        console.log(error);
        setError("Error al cargar los proyectos");
      });
    //se actualizara cada vez que movimientos cambie
  }, []);

  return (
    <div className="card-border-style">
      <h2 className="title-style">Movimientos Registrados</h2>
      <p className="subtitle-style">
        Listado de todos los movimientos bancarios
      </p>

      <div className="overflow-x-auto">
        {/* En caso de tener algun error en la llamada, desplegar informacion */}
        {error ? (
          <div className="subtitle-style text-center">{error}</div>
        ) : /* Si no existen movimientos desplegar mensaje */
        movimientos.length < 0 ? (
          <div className="subtitle-style text-center">
            No se encontraron movimientos
          </div>
        ) : (
          /* Despliegue de los movimientos */
          <table className="w-full border-collapse">
            {/* Encabezado de tabla: Fecha, Tipo, Monto, Descripcion */}
            <thead>
              <tr className="bg-gray-50">
                <th className="title-table-style">Fecha</th>
                <th className="title-table-style">Tipo</th>
                <th className="title-table-style">Monto</th>
                <th className="title-table-style">Descripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {/* Contenido de tabla desplegado de forma dinamica */}
              {movimientos.map((movimiento, index) => (
                <tr key={index}>
                  <td className="date-table-style">
                    {movimiento.fecha.toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge tipoMovimiento={movimiento.tipo} />
                  </td>
                  <td className="date-table-style">{movimiento.monto}</td>
                  <td className="date-table-style">{movimiento.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MovementsTable;
