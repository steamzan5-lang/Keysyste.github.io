import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check URL parameters for step completion
    const urlParams = new URLSearchParams(window.location.search);
    const step = urlParams.get('step');
    
    if (step === '1done') {
      setLocation('/step/2');
    } else if (step === '2done') {
      setLocation('/step/3');
    } else if (step === '3done') {
      setLocation('/success');
    } else {
      setLocation('/step/1');
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
    </div>
  );
}
