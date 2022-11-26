import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/index";
import Login from "./pages/Login/index";
import Register from "./pages/Register/index";
import Refactor from "./pages/RefactoryPassword/index";
import RegisterMedicine from "./pages/RegisterMedicine/index";
import EditMedicine from "./pages/EditMedicine/index";
import { useEffect, useState } from "react";
import api from "./api";
import Medicines from "./pages/Medicines";
import MedicineDetails from "./pages/MedicineDetails";

function App() {
  const [token, setToken] = useState();
  document.title = "Medicine Manager";
  useEffect(() => {
    const getAccount = async () => {
      const token = localStorage.getItem("token");
      setToken(token);
      try {
        const { data } = await api.get('/users/verify');
        console.log(data);
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null);
      }
    }
    getAccount();
  }, [token]);
  return (
    <div className="App">
      <BrowserRouter>
        {!token ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/refactorpassword" element={<Refactor />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Medicines />} />
            <Route path="/registermedicine" element={<RegisterMedicine />} />
            <Route path="/editmedicine/:id" element={<EditMedicine />} />
            <Route path="/medicine-details/:id" element={<MedicineDetails />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
