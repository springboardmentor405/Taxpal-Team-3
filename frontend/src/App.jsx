import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Reports from "./pages/Reports";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/reports" />} />
        <Route
          path="/reports"
          element={
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;