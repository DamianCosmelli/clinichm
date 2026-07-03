import iconoInfo from "../../assets/iconoInfo.svg"; // Importar el ícono de información

const InfoPass = () =>  (
    <div className="flex justify-start items-center gap-1 ml-4">
      <img
        src={iconoInfo}
        alt="Información"
        className="w-3.5 h-3.5"
        style={{ filter: "grayscale(50%)" }} // Aplicar filtro para que sea gris
      />
      <div className="text-[#5E5D5D] text-sm font-normal font-poppins leading-[19.6px] break-words" title='Letras (mayúsculas y minúsculas), números y caracteres especiales !@#$%'>
        Debe tener entre 6 y 12 caracteres.
      </div>
    </div>
  )
export default InfoPass;