import { useEffect, useMemo, useState } from "react";
import "./IssuesPage.css";
import IssueDetailPanel from "../components/IssueDetailPanel";

const API_BASE = "http://localhost:5001/api";

function normalizeStatus(value) {
  if (!value) return "NO STATUS";
  return String(value).trim().toUpperCase();
}

function getStatusName(issue) {
  if (!issue) return "NO STATUS";

  if (issue.status_id && typeof issue.status_id === "object") {
    return normalizeStatus(issue.status_id.name);
  }

  if (issue.status_name) return normalizeStatus(issue.status_name);
  if (issue.status) return normalizeStatus(issue.status);

  return "NO STATUS";
}

function getPriorityName(issue) {
  if (!issue?.priority_id) return "None";
  if (typeof issue.priority_id === "object") return issue.priority_id.name || "None";
  return "None";
}

function getAssigneeName(issue) {
  if (!issue?.assignee_id) return "None";
  if (typeof issue.assignee_id === "object") {
    return (
      issue.assignee_id.display_name ||
      issue.assignee_id.username ||
      issue.assignee_id.email ||
      "None"
    );
  }
  return "None";
}

export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const QUICK_STATUSES = ["ALL", "TODO", "IN PROGRESS", "IN REVIEW", "DONE", "BACKLOG"];
  const TIME_FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'this_week', label: 'This Week' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'upcoming', label: 'Upcoming' },
  ];

  async function loadIssues(timeKey) {
    try {
      setLoading(true);
      setError("");

      const q = timeKey && timeKey !== 'all' ? `?time=${encodeURIComponent(timeKey)}` : '';
      const res = await fetch(`${API_BASE}/issues${q}`);
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json.message || "Không tải được danh sách issues");
      }

      setIssues(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err.message || "Có lỗi khi tải issues");
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }

  async function openIssueDetail(id) {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/issues/${id}`);
      if (!res.ok) throw new Error('Failed to fetch issue');
      const json = await res.json().catch(() => ({}));
      const issueData = json.data || json;
      setSelectedIssue(issueData);
      setPanelOpen(true);
    } catch (err) {
      setError(err.message || 'Không tải được chi tiết issue');
    }
  }

  function closePanel() {
    setPanelOpen(false);
    setSelectedIssue(null);
  }

  useEffect(() => {
    loadIssues();
  }, []);

  const statusFilters = useMemo(() => {
    const names = [...new Set(issues.map((issue) => getStatusName(issue)))];
    return ["ALL", ...names];
  }, [issues]);

  const filteredIssues = useMemo(() => {
    let result = [...issues];

    if (activeFilter !== "ALL") {
      result = result.filter((issue) => getStatusName(issue) === activeFilter);
    }

    const keyword = search.trim().toLowerCase();
    if (keyword) {
      result = result.filter((issue) => {
        const issueKey = (issue.issue_key || "").toLowerCase();
        const summary = (issue.summary || "").toLowerCase();
        const assignee = getAssigneeName(issue).toLowerCase();

        return (
          issueKey.includes(keyword) ||
          summary.includes(keyword) ||
          assignee.includes(keyword)
        );
      });
    }

    return result;
  }, [issues, search, activeFilter]);

  function toggleQuickFilter(status) {
    if (status === "ALL") return setActiveFilter("ALL");
    // map common labels to normalized version used by getStatusName
    const normalized = status.toUpperCase();
    setActiveFilter((prev) => (prev === normalized ? "ALL" : normalized));
  }

  function toggleTimeFilter(key){
    const newKey = (timeFilter === key) ? 'all' : key;
    setTimeFilter(newKey);
    loadIssues(newKey);
  }

  return (
    <div className="page-shell">
      <div className="issues-page-header">
        <h1 className="page-title">Issues</h1>

        <div className="issues-page-actions">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="issues-search-input"
          />
          <button className="issues-add-btn">+ Add New</button>
        </div>
      </div>

      <div className="issues-filter-bar">
        {QUICK_STATUSES.map((s) => (
          <button
            key={s}
            className={`issues-filter-chip ${activeFilter === s ? "active" : ""}`}
            onClick={() => toggleQuickFilter(s)}
          >
            {s}
          </button>
        ))}

        <div style={{ width: 12 }} />
        {TIME_FILTERS.map(t => (
          <button key={t.key} className={`issues-filter-chip quick ${timeFilter===t.key? 'active':''}`} onClick={()=>toggleTimeFilter(t.key)}>{t.label}</button>
        ))}

        <div style={{ width: 12 }} />
        <button className="issues-refresh-btn" onClick={()=>loadIssues(timeFilter)}>
          Refresh
        </button>
      </div>

      <div className="page-card">
        {loading && <div className="issues-empty-state">Đang tải issues...</div>}

        {!loading && error && <div className="issues-error-state">{error}</div>}

        {!loading && !error && (
          <div className="issues-table-wrapper">
            <table className="issues-table">
              <thead>
                <tr>
                  <th>KEY</th>
                  <th>SUMMARY</th>
                  <th>STATUS</th>
                  <th>PRIORITY</th>
                  <th>ASSIGNEE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="issues-empty-row">
                      Không có issue phù hợp
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => (
                    <tr key={issue._id || issue.issue_key}>
                      <td>{issue.issue_key || "NO-KEY"}</td>
                      <td>{issue.summary || "Untitled issue"}</td>
                      <td>{getStatusName(issue)}</td>
                      <td>{getPriorityName(issue)}</td>
                      <td>{getAssigneeName(issue)}</td>
                      <td>
                        <div className="issues-actions-cell">
                          <button className="issues-action-btn" onClick={() => openIssueDetail(issue._id)}>View</button>
                          <button className="issues-action-btn">Edit</button>
                          <button className="issues-action-btn danger">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {panelOpen && (
        <IssueDetailPanel issue={selectedIssue} onClose={closePanel} />
      )}
    </div>
  );
}