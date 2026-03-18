import { Routes, Route, Navigate } from "react-router-dom";
import Budget from "./pages/Budget";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/budgets" />} />
      <Route path="/budgets" element={<Budget />} />
    </Routes>
  );
}

export default App;