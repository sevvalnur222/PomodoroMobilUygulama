import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

export function useTimer(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [distractions, setDistractions] = useState(0); // kaç kez dikkatin dağıldı

  const intervalRef = useRef<number | null>(null);
  const appState = useRef(AppState.currentState);

  const start = () => {
    if (running) return;
    setRunning(true);

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;
  };

  const pause = () => {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    pause();
    setSeconds(initialSeconds);
    setDistractions(0);
  };

  //  AppState Listener — Uygulama arka plana geçince sayacı durdurur
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      // aktif → arka plana gidiyorsa
      if (
        appState.current === "active" &&
        nextState.match(/inactive|background/) &&
        running
      ) {
        pause();
        setDistractions((prev) => prev + 1); // dikkatin dağıldı
      }

      appState.current = nextState;
    });

    return () => sub.remove();
  }, [running]);

  return {
    seconds,
    running,
    distractions, // ileride seans özetinde göstereceğiz
    start,
    pause,
    reset,
  };
}
