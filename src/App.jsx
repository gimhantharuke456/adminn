import "antd/dist/reset.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginPage />} path="/" />
        <Route element={<DashboardPage />} path="/dashboard" />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
