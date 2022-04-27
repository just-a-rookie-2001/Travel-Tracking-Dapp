import React from "react";
import { AddPersonToFlight, Login, CreateDesk, CreatePerson, CreateFlight } from "./pages";
import { Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import useAuth from "./store/auth-store";

const App: React.FC = () => {
  const { setUser, defaultState } = useAuth();
  React.useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (!u) return defaultState();
      setUser(u.uid);
    });
  }, []);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/create-desk" element={<CreateDesk />} />
      <Route path="/createperson" element={<CreatePerson />} />
      <Route path="/createflight" element={<CreateFlight />} />
      <Route path="/add" element={<AddPersonToFlight />} />
    </Routes>
  );
};

export default App;
