import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface SelectInputProps<T extends FieldValues> {
  name: Path<T>;
  register?: UseFormRegister<T>;
  className?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  value?:string;
}

const SelectRedSocial = <T extends FieldValues>({
  name,
  register,
  className,
  placeholder = "Seleccione una opción",
  onChange,
  value,
}: SelectInputProps<T>) => {
  const opcionesPublicidad = [
    { value: "Instagram", label: "Instagram" },
    { value: "Facebook", label: "Facebook" },
    { value: "WhatsApp", label: "WhatsApp" },
    { value: "TikTok", label: "TikTok" },
    { value: "Via Publica", label: "Vía Pública" },
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
      {opcionesPublicidad.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectRedSocial;
