import iconoError from '../../assets/triang_Error.svg'; 

interface ErrorPassProps {
  message: string;
}
const ErrorPass = ({ message }: ErrorPassProps) => {
  return (
    <div className="flex justify-start items-center gap-1 ml-4">
      <img
        src={iconoError}
        alt="error"
        className="mr-1 w-[14px] h-[14px]"
      />
      <div className="text-red-800 text-sm font-normal font-poppins leading-[19.6px] break-words">
        {message}
      </div>
    </div>);
}
export default ErrorPass;