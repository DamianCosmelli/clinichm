import React from "react";
import LoginForm from "../components/Login/LoginForm";

const Login: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
          <LoginForm />
      </div>
    </>
  );
};

export default Login;
