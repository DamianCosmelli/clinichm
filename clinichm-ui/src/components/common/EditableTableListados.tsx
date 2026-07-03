import React, { useState } from 'react';
import { Card, Typography} from '@material-tailwind/react';
import iconoEditar from '../../assets/iconoEditar.svg';
import iconoGuardar from '../../assets/floppy-disk.svg';
import iconoCerrar from '../../assets/icon-close.svg';
import iconoEliminar from '../../assets/iconoEliminar.svg'; // Importar el ícono de eliminar
import iconoTransfer from '../../assets/iconoTransfer.svg'; // Importar el ícono de transfer

interface EditableTableListadosProps {
  headers: string[];
  rows: Array<{ [key: string]: string | number | React.ReactNode | null }>;
  onSave: (id: number, updatedRow: { [key: string]: string | number | null }) => void;
}

export const BotonesEdicion: React.FC<{
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showTransfer?: boolean; // Nuevo prop opcional
  onTransfer?: () => void; // Nuevo prop
}> = ({ isEditing, onSave, onCancel, onEdit, onDelete, showTransfer, onTransfer }) => (
  <>
    {isEditing ? (
      <div className="flex items-center justify-center space-x-2 -ml-5">
        <img
          src={iconoGuardar}
          alt="Guardar"
          title="Guardar"
          className="cursor-pointer w-5 h-5"
          onClick={onSave}
        />
        <img
          src={iconoCerrar}
          alt="Cancelar"
          title="Cancelar"
          className="cursor-pointer w-5 h-5"
          onClick={onCancel}
        />
      </div>
    ) : (
      <div className="flex items-center justify-center space-x-4 -ml-5">
        <img
          src={iconoEditar}
          alt="Editar"
          title="Editar"
          className="cursor-pointer w-5 h-5"
          onClick={onEdit}
        />
        <img
          src={iconoEliminar}
          alt="Eliminar"
          title="Eliminar"
          className="cursor-pointer w-5 h-5"
          onClick={onDelete}
        />
        {/* Icono Transfer solo si showTransfer es true */}
        {showTransfer && (
          <img
            src={iconoTransfer}
            alt="Transferir"
            title="Transferir"
            className="cursor-pointer w-5 h-5"
            onClick={onTransfer}
          />
        )}
      </div>
    )}
  </>
);

const EditableTableListados: React.FC<EditableTableListadosProps> = ({ headers, rows }) => {
  const [editRowId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string | number | null }>({});

  return (
    <Card className="h-full w-full overflow-scroll">
      <table className="w-full min-w-max table-auto text-left">
        <thead className="table-header-group">
          <tr className="rounded-t-md border-b border-[rgba(0,91,75,0.5)] bg-[rgba(0,91,75,0.15)]">
            {headers.map((header) => (
              <th key={header} className="p-4 text-center">
                <Typography variant="small" color="black" className="font-normal leading-none opacity-70">
                  {header}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-row-group">
          {rows.map((row, index) => (
            <tr key={index} className={`${index % 2 === 0 ? 'bg-[#F3F3F3]' : 'bg-[#D4D4D4]'}`}>
              {headers.map((header, idx) => (
                <td key={idx} className="p-4 text-center">
                  {editRowId === row.id ? (
                    <input
                      className="w-32"
                      type="text"
                      value={formData[header] !== undefined ? String(formData[header]) : ''}
                      onChange={(e) => setFormData({ ...formData, [header]: e.target.value })}                    
                    />
                 
                  ) : (
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {row[header]}
                    </Typography>
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

export default EditableTableListados;
