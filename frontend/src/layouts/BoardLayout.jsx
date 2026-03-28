import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";
import IssueDetailPanel from "../components/issue/IssueDetailPanel";

export default function BoardLayout({ children }) {
  return (
    <div className="jira-app">

      <Topbar />

      <div className="jira-body">

        <Sidebar />

        <main className="jira-content">
          {children}
        </main>

        <IssueDetailPanel />

      </div>

    </div>
  );
}