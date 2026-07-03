import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface SelectInputProps<T extends FieldValues> {
  name: Path<T>;
  register?: UseFormRegister<T>;
  className?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  value?: string;
}

const SelectMotivo = <T extends FieldValues>({
  name,
  register,
  className,
  placeholder = "Seleccione un motivo",
  onChange,
  value,
}: SelectInputProps<T>) => {
  const opcionesMotivo = [
    { value: "Consulta", label: "Consulta" },
    { value: "Retoque", label: "Retoque" },
    { value: "Tratamiento", label: "Tratamiento" },
  ];

  return (
    <select
      {...(register && !value ? register(name) : {})}
      className={className}
      onChange={(e) => {
        if (onChange) onChange(e);
        if (register) register(name).onChange(e); // Asegurar que el valor se guarde en el estado del formulario
      }}
      value={value}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {opcionesMotivo.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectMotivo;
