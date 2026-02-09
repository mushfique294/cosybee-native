import React, { createContext, useContext, useEffect, useState } from "react";

import {
    loadTheme,
    saveTheme,
    type AppTheme,
} from "@/src/storage/theme.storage";

type ThemeContextType = {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>("system");

  useEffect(() => {
    loadTheme().then((storedTheme) => {
      if (storedTheme) {
        setThemeState(storedTheme);
      }
    });
  }, []);

  function setTheme(newTheme: AppTheme) {
    setThemeState(newTheme);
    saveTheme(newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
