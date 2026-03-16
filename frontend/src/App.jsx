import { NavLink, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import HomePage from "./pages/HomePage.jsx";
import PlansPage from "./pages/PlansPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";

import LoginPage from "./features/auth/loginPage.jsx";
import DashboardsPage from "./features/dashboard/DashboardsPage.jsx";
import ProjectsPage from "./features/projects/ProjectsPage.jsx";
import IssuesPage from "./features/issues/IssuesPage.jsx";
import BoardsPage from "./features/board/BoardsPage.jsx";
import RegisterPage from "./features/auth/registerPage.jsx";


function App() {
  return (
    <div className="jira-page">
      <header className="jira-topnav">
        <div className="jira-topnav-left">
          <div className="jira-app-grid" />
          <div className="jira-logo-mark" />

          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboards"
              element={
                <ProtectedRoute>
                  <DashboardsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/issues"
              element={
                <ProtectedRoute>
                  <IssuesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/boards"
              element={
                <ProtectedRoute>
                  <BoardsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/plans"
              element={
                <ProtectedRoute>
                  <PlansPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        <div className="jira-topnav-right">
          <div className="jira-search-box">Search</div>
          <div className="jira-top-icon" />
          <div className="jira-top-icon" />
          <div className="jira-avatar" />
        </div>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboards" element={<DashboardsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/create" element={<CreatePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;