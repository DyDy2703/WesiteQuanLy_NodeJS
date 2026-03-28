import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import Navbar from "./partials/navbar.jsx"; // Import component Header mới

import HomePage from "./pages/HomePage.jsx"
// import PlansPage from "./pages/PlansPage.jsx";
// import CreatePage from "./pages/CreatePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
// import DashboardsPage from "./features/dashboard/DashboardsPage.jsx";
// import ProjectsPage from "./features/projects/ProjectsPage.jsx";
// import IssuesPage from "./features/issues/IssuesPage.jsx";
// import BoardsPage from "./features/board/BoardsPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  return (
    <div className="jira-page">
      {/* Navbar sẽ luôn hiển thị ở mọi trang */}
      {/* <Navbar /> */}

      <main className="page-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/homepage" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          {/* <Route path="/dashboards" element={<ProtectedRoute><DashboardsPage /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/issues" element={<ProtectedRoute><IssuesPage /></ProtectedRoute>} />
          <Route path="/boards" element={<ProtectedRoute><BoardsPage /></ProtectedRoute>} />
          <Route path="/plans" element={<ProtectedRoute><PlansPage /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreatePage /></ProtectedRoute>} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;