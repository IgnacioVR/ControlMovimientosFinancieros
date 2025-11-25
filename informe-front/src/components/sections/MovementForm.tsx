import { useState } from "react";
import type { MovementType, Movement } from "../../types/interface";

function MovementForm() {
  // Estados para el formulario de registro
  const [fecha, setFecha] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [monto, setMonto] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");

  //
  const handleRegistrarMovimiento = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    //no acepta vacio, excepto descripcion
    if (!fecha || !tipo || !monto) {
      alert("Por favor, completa todos los campos obligatorios (*)");
      return;
    }

    // Regula que no sea una fecha del futuro
    const fechaObj = new Date(fecha);
    if (fechaObj.getTime() > Date.now()) {
      alert("Por favor, completa con una fecha valida");
      return;
    }

    //creacion de objeto de tipo Movement
    const nuevoMovimiento: Movement = {
      fecha: new Date(fecha),
      tipo: tipo as MovementType,
      monto: Number(monto),
      descripcion,
    };

    //tranformar a negativo el monto si el movimiento es de tipo debito
    if (nuevoMovimiento.tipo === "DEBITO") {
      nuevoMovimiento.monto = -nuevoMovimiento.monto;
    }

    //preparacion de la URL
    const url = new URL(`${import.meta.env.VITE_URL_ENDPOINT}/movements`);

    fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...nuevoMovimiento,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          alert("Se agrego con exito el movimiento");
          // Para limpiar formulario y actualizar la tabla
          window.location.reload();
        }
      })
      .catch(() => {
        alert("Error al registrar el movimento");
      });
  };

  return (
    <div className="card-border-style">
      <h2 className="title-style">Registrar Movimiento</h2>
      <p className="subtitle-style">
        Ingresa los datos del nuevo movimiento bancario.
      </p>

      <form onSubmit={handleRegistrarMovimiento}>
        {/* Ingresar fecha */}
        <div className="mb-4">
          <label className="label-style">Fecha *</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="input-style"
            required
          />
        </div>

        {/* Tipo (credito o debito) */}
        <div className="mb-4">
          <label className="label-style">Tipo *</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="input-style"
            required
          >
            <option value="">Selecciona el tipo</option>
            <option value="CREDITO">Crédito</option>
            <option value="DEBITO">Débito</option>
          </select>
        </div>

        {/* Ingresar Monto*/}
        <div className="mb-4">
          <label className="label-style">Monto *</label>
          <input
            type="number"
            min={1}
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="input-style"
            required
          />
        </div>

        {/* Ingresar Descripcion */}
        <div className="mb-6">
          <label className="label-style">Descripción</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción opcional"
            className="input-style"
          />
        </div>

        <button type="submit" className="button-style">
          Registrar Movimiento
        </button>
      </form>
    </div>
  );
}

export default MovementForm;
