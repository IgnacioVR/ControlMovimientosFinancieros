function Badge(props: { tipoMovimiento: any }) {
  const type = props.tipoMovimiento;

  //CREDITO = insignia verde
  //DEBITO = insignia roja
  const style =
    type === "CREDITO"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${style}`}
    >
      {type}
    </span>
  );
}

export default Badge;
