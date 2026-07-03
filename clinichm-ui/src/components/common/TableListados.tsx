import React from "react";
import { Card, Typography, Tooltip } from "@material-tailwind/react";
import infoIcon from "../../assets/iconoInfo.svg";

interface TableListadosProps {
  headers: string[];
  rows: Array<{ [key: string]: string | number | React.ReactNode | null }>;
  showTooltip?: boolean; // Propiedad opcional para mostrar el Tooltip
}

const getCellClassName = (header: string) => {
  return `p-4 text-center ${
    header === "Movimiento" ? "flex items-center justify-center gap-2" : ""
  }`;
};

const TableListados: React.FC<TableListadosProps> = ({ headers, rows, showTooltip = true }) => {
  return (
    <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto text-left">
        <thead className="table-header-group">
          <tr className="rounded-t-md border-b border-[rgba(0,91,75,0.5)] bg-[rgba(0,91,75,0.15)]">
            {headers.map((header) => (
              <th key={header} className="p-4 text-center">
                <Typography
                  variant="small"
                  color="black"
                  className="font-normal leading-none opacity-70 flex items-center justify-center gap-2"
                >
                  {header}
                  {showTooltip && header === "Monto" && (
                    <Tooltip
                      content={
                        <span style={{ color: "#111111", backgroundColor: "#FFFFFF", padding: "4px", borderRadius: "4px" }}>
                          El monto representa el total en efectivo disponible.
                        </span>
                      }
                    >
                      <img src={infoIcon} alt="Info" className="w-4 h-4 cursor-pointer" />
                    </Tooltip>
                  )}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-row-group">
          {rows.map((row, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-[#F3F3F3]" : "bg-[#D4D4D4]"
              }`}
            >
              {headers.map((header, idx) => (
                <td key={idx} className={getCellClassName(header)}>
                  {typeof row[header] === "string" || typeof row[header] === "number" ? (
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {row[header]}
                    </Typography>
                  ) : (
                    <div className="font-normal">{row[header]}</div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default TableListados;
