import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface SelectInputProps<T extends FieldValues> {
  name: Path<T>;
  register?: UseFormRegister<T>;
  className?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  value?: string;
}

const SelectEstadosRecepcion = <T extends FieldValues>({
  name,
  register,
  className,
  placeholder = "Seleccione un estado",
  onChange,
  value,
}: SelectInputProps<T>) => {
  const opcionesEstados = [
    { value: "En Espera", label: "En Espera" },
    { value: "Ingresado", label: "Ingresado" },
    { value: "Finalizado", label: "Finalizado" },
  ];

  return (
    <select
      {...(register && !value ? register(name) : {})}
      className={className}
      {...(onChange ? { onChange } : {})}
      value={value}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {opcionesEstados.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectEstadosRecepcion;
