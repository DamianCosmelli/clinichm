import React from 'react';
import ErrorImage from '../assets/Error.svg';
import BotonConIcono from '../../components/common/BotonConIcono';

const ErrorPage: React.FC = () => {
  return (
    <div className="w-full h-full p-8 bg-[#FBFBFB] rounded-lg outline-1 outline-[#7A7979] outline-offset-[-1px] flex flex-col justify-center items-center gap-8">
      <div className="w-[440px] flex flex-col justify-start items-center gap-8">
        <img src={ErrorImage} alt="Error" className="w-[400px] h-[500px] mt-[-150px]" />
        <div className="w-full flex flex-col justify-start items-start">
          <div className="w-full px-2 flex flex-col justify-start items-center ">
            <div className="text-[#111111] text-2xl font-medium leading-[33.6px] font-poppins break-words mt-[-100px]">
              Tuvimos un problema inesperado
            </div>
          </div>
          <div className="w-full text-center text-[#111111] text-lg font-normal leading-7 font-poppins break-words mt-[-60px]">
            Lo sentimos, no sabemos que pasó pero estamos trabajando en resolverlo.
          </div>
        </div>
        <div className="w-full h-12 py-2.5 px-2.5 flex justify-start">
          <BotonConIcono
            label="Reintentar"
            onClick={() => window.location.reload()}
            className="w-[415px] h-full bg-[#D69E41] hover:bg-[#B8863B] text-[#111111] font-semibold flex justify-center items-center"
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
