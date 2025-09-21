import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const onChange = () => setMatches(mediaQuery.matches);
    
    // Set initial value
    onChange();
    
    // Listen for changes
    mediaQuery.addEventListener("change", onChange);
    
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [query]);
  
  return matches;
}
