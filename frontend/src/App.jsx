import { NavLink, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import DashboardsPage from "./pages/DashboardsPage";
import ProjectsPage from "./pages/ProjectsPage";
import IssuesPage from "./pages/IssuesPage";
import BoardsPage from "./pages/BoardsPage";
import PlansPage from "./pages/PlansPage";
import CreatePage from "./pages/CreatePage";

function App() {
  return (
    <div className="jira-page">
      <header className="jira-topnav">
        <div className="jira-topnav-left">
          <div className="jira-app-grid" />
          <div className="jira-logo-mark" />

          <NavLink to="/" className="jira-brand-link">
            TODO
          </NavLink>

          <NavLink to="/dashboards" className="jira-nav-link">
            Dashboards
          </NavLink>

          <NavLink to="/projects" className="jira-nav-link">
            Projects
          </NavLink>

          <NavLink to="/issues" className="jira-nav-link">
            Issues
          </NavLink>

          <NavLink to="/boards" className="jira-nav-link">
            Boards
          </NavLink>

          <NavLink to="/plans" className="jira-nav-link">
            Plans
          </NavLink>

          <NavLink to="/create" className="jira-create-btn">
            Create
          </NavLink>
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