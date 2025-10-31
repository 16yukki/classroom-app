import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]); // array of class objects

  // Load from localStorage once on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("classroom_user"));
    const storedClasses = JSON.parse(localStorage.getItem("classroom_classes"));
    if (storedUser) setUser(storedUser);
    if (storedClasses) setClasses(storedClasses);
  }, []);

  // Save to localStorage when user or classes change
  useEffect(() => {
    localStorage.setItem("classroom_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("classroom_classes", JSON.stringify(classes));
  }, [classes]);

  // helper to logout
  const logout = () => {
    setUser(null);
    // optionally keep classes in storage for next login
  };

  return (
    <AppContext.Provider value={{ user, setUser, classes, setClasses, logout }}>
      {children}
    </AppContext.Provider>
  );
};
