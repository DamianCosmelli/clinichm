import React, { useRef } from 'react';
import logo from '../../assets/logo-db-3.png';
import BotonConIcono from '../common/BotonConIcono';
import IconoWhatsapp from '../../assets/IconoWhatsapp.svg';
import IconoComentario from '../../assets/IconoComentario.svg';
import "../../styles/CodeInput.css";

const CodeInput: React.FC = () => {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 1 && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && index > 0 && !inputsRef.current[index]?.value) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputsRef.current[index] = el!;
  };

  return (
    <div className="w-full h-full p-18 bg-[#FBFBFB] rounded-lg outline-1 outline-[#7A7979] outline-offset-[-1px] flex flex-col justify-center items-center gap-6">
      <div className="w-[520px] flex flex-col justify-start items-center gap-6">
        <div className="w-[60px] h-[61px] p-2.5 bg-[#272626] rounded-full flex justify-center items-center">
          <img
            className="w-[39.68px] h-[41px]"
            src={logo}
            alt="Logo"
          />
        </div>
        <div className="w-full px-2 flex flex-col justify-start items-center gap-4">
          <div className="text-[#111111] text-2xl font-poppins font-medium leading-[33.6px] break-words">
            Ingresá el código
          </div>
        </div>
        <div className="w-full py-8 flex flex-col justify-center items-center gap-6 ">
          <div className="w-full flex justify-center items-center gap-12">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  ref={setInputRef(index)}
                  onChange={(event) => handleInputChange(index, event)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  className="w-[65.09px] h-[60px] text-center text-xl font-poppins font-medium border border-[#111111] rounded focus:outline-none focus:ring-2 focus:ring-[#D69E41]"
                />
              ))}
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-1">
            <div className="w-full text-center text-[#111111] text-sm font-poppins font-normal leading-[19.6px] break-words">
              Te enviamos por SMS un código al +54 11 2345 6789.
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center gap-8 mr-60">
          <div className="flex mr-60">
            <BotonConIcono
              label="Reenviar por WhatsApp"
              iconSrc={IconoWhatsapp}
              className="boton-reenviar-whatsapp"
            />
          </div>
          <div className="flex">
            <BotonConIcono
              label="Reenviar por SMS"
              iconSrc={IconoComentario}
              className="boton-reenviar-sms"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeInput;
