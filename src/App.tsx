import { About, Login, SignUp, CreatePerson, CreateFlight } from "./pages";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/createperson" element={<CreatePerson />} />
      <Route path="/createflight" element={<CreateFlight />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default App;
