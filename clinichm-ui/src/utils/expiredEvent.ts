import { useEffect, useState } from "react";

function useIsEventExpired(eventHoraIso: string) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const checkIfExpired = () => {
      const now = new Date();
      const eventDate = new Date(eventHoraIso);
      const expirationTime = new Date(eventDate.getTime() + 30 * 60 * 1000); // +30 minutos

      setExpired(now > expirationTime);
    };

    checkIfExpired(); // inicial
    const interval = setInterval(checkIfExpired, 60000); // cada minuto

    return () => clearInterval(interval);
  }, [eventHoraIso]);

  return expired;
}

export default useIsEventExpired;