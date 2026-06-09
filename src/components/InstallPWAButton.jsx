import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Si el evento ya ocurrió antes de que React montara este componente, lo usamos
    if (window.deferredPWAInstallPrompt) {
      setDeferredPrompt(window.deferredPWAInstallPrompt);
      setIsVisible(true);
    }

    // Escuchar el evento que indica que la app se puede instalar (por si ocurre después)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPWAInstallPrompt = e;
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    // Escuchar si la app ya fue instalada (para ocultar el botón)
    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      window.deferredPWAInstallPrompt = null;
      console.log('PWA fue instalada exitosamente');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Mostrar el prompt nativo de instalación
    deferredPrompt.prompt();
    // Esperar la respuesta del usuario (aceptar o rechazar)
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Respuesta del usuario al prompt de instalación: ${outcome}`);
    
    // El prompt solo se puede usar una vez, así que lo descartamos
    setDeferredPrompt(null);
    
    // Si aceptó, ocultamos el botón
    if (outcome === 'accepted') {
      setIsVisible(false);
      window.deferredPWAInstallPrompt = null;
    }
  };

  // Detectar si la app ya se está ejecutando como PWA instalada
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://');

  // Si ya está instalada o no ha disparado el evento, ocultamos el botón
  if (!isVisible || isStandalone) {
    return null;
  }

  return (
    <Button 
      variant="outline-primary" 
      onClick={handleInstallClick}
      className="d-flex align-items-center gap-2 btn-sm ms-auto me-2"
    >
      <i className="bi bi-download"></i>
      <span className="d-none d-md-inline">Instalar App</span>
    </Button>
  );
};

export default InstallPWAButton;
