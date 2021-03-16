import React, { useState } from "react";
import { themes } from "../Styling/Themes";

export const AppContext = React.createContext(null);

export default ({ children }) => {
  const [theme, changeTheme] = useState(themes[0]);

  return (
    <AppContext.Provider value={{ theme: theme, changeTheme }}>
      {children}
    </AppContext.Provider>
  );
};
