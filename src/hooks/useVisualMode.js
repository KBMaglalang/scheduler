import { useState } from 'react'

export default function useVisualMode(initial) {
  let [mode, setMode] = useState(initial);
  let [history,setHistory] = useState([initial]);
  
  const transition = (newMode, replace = false) => {
    setMode(newMode);
    
    if(replace) {
      setHistory(prev => prev.length > 1 ? [...prev.slice(0, -1), newMode] : [prev]);
      return;
    }

    setHistory(prev => [...prev, newMode]);
  };

  const back = () => {
    const newHistory = history.length > 1 ? history.slice(0, -1) : [initial];
    setHistory(newHistory);
    setMode(newHistory[newHistory.length - 1]);
  };

  return {mode, transition, back};
}

