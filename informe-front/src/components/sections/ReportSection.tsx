import { useState, useEffect } from "react";

function ReportSection(props: {
  titulo: any;
  debito: any;
  credito: any;
  balance: any;
}) {
  const titulo = props.titulo;
  const totalDebito = props.debito;
  const totalCredito = props.credito;
  const balance = props.balance;

  const [style, setStyle] = useState(
    "px-4 py-3 text-sm font-medium text-gray-900 text-right"
  );

  useEffect(() => {
    if (balance > 0) {
      setStyle("px-4 py-3 text-sm font-medium text-green-700 text-right");
    } else {
      setStyle("px-4 py-3 text-sm font-medium text-red-700 text-right");
    }
  }, [balance]);

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
              {titulo}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-4 py-3 text-sm text-gray-700">Total Crédito:</td>
            <td className="px-4 py-3 text-sm text-gray-900 text-right">
              {totalCredito}
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm text-gray-700">Total Débito:</td>
            <td className="px-4 py-3 text-sm text-gray-900 text-right">
              {totalDebito}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="px-4 py-3 text-sm font-medium text-gray-900">
              Balance:
            </td>
            <td className={style}>{balance}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ReportSection;
