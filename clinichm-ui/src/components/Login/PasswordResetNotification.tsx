import IconCheck from '../../assets/icon-check.svg';
//import IconClose from '../../assets/icon-close.svg';
import BotonConIcono from '../common/BotonConIcono';


interface PasswordResetNotificationProps {
  onClose: () => void;
}

const PasswordResetNotification : React.FC<PasswordResetNotificationProps> = ({ onClose }) => {

  return (
    <div className="w-full h-120 py-16 p-8 bg-[#FBFBFB] rounded-lg outline-1 outline-[#7A7979] outline-offset-[-1px] flex flex-col justify-start items-center gap-16">
      <div className="self-stretch h-12 flex justify-end items-center -mt-12">
        {/*<img
          src={IconClose}
          alt="Close Icon"
          className="w-6 h-6 cursor-pointer"
          onClick={onClose}
        />*/}
      </div>
      <div className="flex flex-col justify-start items-center gap-6">
        <div className="w-15 h-[61px] p-2.5 bg-[rgba(0,91,75,0.10)] rounded-full outline-1 outline-[#005B4B] outline-offset-[-1px] flex justify-center items-center">
          <img src={IconCheck} alt="Check Icon" className="w-10 h-10" />
        </div>
        <div className="w-[418px] px-2 flex flex-col justify-start items-center gap-4">
          <div className="text-[#111111] text-2xl font-medium font-poppins leading-[33.6px] break-words">
            Contraseña actualizada
          </div>
        </div>
        <div className="self-stretch text-center text-[#111111] text-xl font-normal font-poppins leading-7 break-words">
          En el próximo ingreso utiliza la nueva clave.
        </div>
        <div className="self-stretch flex justify-start items-start gap-2.5 px-6">
          <BotonConIcono
            label="Cerrar"
            className="w-94 h-12 py-2.5 px-8 bg-[#D69E41] rounded text-[#111111] text-base font-semibold font-poppins justify-center leading-[22.4px]"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordResetNotification;
