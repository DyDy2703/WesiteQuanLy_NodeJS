import { useEffect, useMemo, useState } from "react";
import "./BoardsPage.css";

const API_BASE = "http://localhost:5001/api";
const USE_MOCK_DATA = true;
function normalizeStatus(value) {
  if (!value) return "NO STATUS";
  return String(value).trim().toUpperCase();
}

function getIssueStatus(issue, statusMap) {
  if (!issue) return "NO STATUS";

  if (issue.status_id && typeof issue.status_id === "object" && issue.status_id.name) {
    return normalizeStatus(issue.status_id.name);
  }

  if (typeof issue.status_id === "string" && statusMap[issue.status_id]) {
    return normalizeStatus(statusMap[issue.status_id].name);
  }

  if (issue.status_name) return normalizeStatus(issue.status_name);
  if (issue.status) return normalizeStatus(issue.status);

  return "NO STATUS";
}

function getIssueKey(issue) {
  return issue?.issue_key || issue?.key || issue?._id?.slice(-6) || "NO-KEY";
}

function getIssueTitle(issue) {
  return issue?.summary || issue?.title || "Untitled issue";
}

function getProject(issue) {
  if (issue?.project_id && typeof issue.project_id === "object") {
    return issue.project_id.name || issue.project_id.key || "No Project";
  }
  return "No Project";
}

function getAssignee(issue) {
  if (issue?.assignee_id && typeof issue.assignee_id === "object") {
    return (
      issue.assignee_id.display_name ||
      issue.assignee_id.username ||
      issue.assignee_id.email ||
      "None"
    );
  }
  return "None";
}

function getPriority(issue) {
  if (issue?.priority_id && typeof issue.priority_id === "object") {
    return issue.priority_id.name || "None";
  }

  if (typeof issue?.priority === "string") return issue.priority;

  return "None";
}

function getType(issue) {
  if (issue?.type_id && typeof issue.type_id === "object" && issue.type_id.name) {
    const name = issue.type_id.name.toLowerCase();
    if (name.includes("bug")) return "bug";
    if (name.includes("task")) return "task";
  }
  return "story";
}

function getTypeClass(type) {
  if (type === "bug") return "issue-type bug";
  if (type === "task") return "issue-type task";
  return "issue-type story";
}

function IssueCard({ issue, statusMap, onClick }) {
  return (
    <div className="jira-card" onClick={() => onClick(issue)}>
      <div className="jira-card-key">{getIssueKey(issue)}</div>
      <div className="jira-card-title">{getIssueTitle(issue)}</div>

      <div className="jira-project-tag">{getProject(issue)}</div>

      <div className="jira-card-status-text">{getIssueStatus(issue, statusMap)}</div>
      <div className="jira-card-muted">{getAssignee(issue)}</div>
      <div className="jira-card-muted">{getPriority(issue)}</div>

      <div className="jira-card-footer">
        <div className="jira-mini-avatar" />
        <div className={getTypeClass(getType(issue))} />
        <div className="jira-equals">=</div>
        <div className="jira-pill-empty" />
      </div>
    </div>
  );
}

function IssueModal({ issue, statusMap, onClose }) {
  if (!issue) return null;

  return (
    <div className="jira-modal-overlay" onClick={onClose}>
      <div className="jira-modal" onClick={(e) => e.stopPropagation()}>
        <div className="jira-modal-header">
          <div>
            <div className="jira-modal-key">{getIssueKey(issue)}</div>
            <h2>{getIssueTitle(issue)}</h2>
          </div>
          <button className="jira-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="jira-modal-grid">
          <div className="jira-modal-item">
            <span>Status</span>
            <strong>{getIssueStatus(issue, statusMap)}</strong>
          </div>
          <div className="jira-modal-item">
            <span>Project</span>
            <strong>{getProject(issue)}</strong>
          </div>
          <div className="jira-modal-item">
            <span>Assignee</span>
            <strong>{getAssignee(issue)}</strong>
          </div>
          <div className="jira-modal-item">
            <span>Priority</span>
            <strong>{getPriority(issue)}</strong>
          </div>
        </div>

        <div className="jira-modal-item board-modal-description">
          <span>Description</span>
          <strong>{issue?.description || "Không có mô tả"}</strong>
        </div>
      </div>
    </div>
  );
}

export default function BoardsPage() {
  const [issues, setIssues] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBoardData() {
    try {
      setLoading(true);
      setError("");

      const [issuesRes, statusRes] = await Promise.all([
        fetch(`${API_BASE}/issues`),
        fetch(`${API_BASE}/status-types`),
      ]);

      const issuesJson = await issuesRes.json().catch(() => ({}));
      const statusJson = await statusRes.json().catch(() => ({}));

      if (!issuesRes.ok) {
        throw new Error(issuesJson.message || "Không tải được issues");
      }

      if (!statusRes.ok) {
        throw new Error(statusJson.message || "Không tải được status types");
      }

      const issuesData = Array.isArray(issuesJson.data)
        ? issuesJson.data
        : Array.isArray(issuesJson)
        ? issuesJson
        : [];

      const statusData = Array.isArray(statusJson.data)
        ? statusJson.data
        : Array.isArray(statusJson)
        ? statusJson
        : [];

      setIssues(issuesData);
      setStatusTypes(statusData);
    } catch (err) {
      setError(err.message || "Lỗi tải dữ liệu board");
      setIssues([]);
      setStatusTypes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoardData();
  }, []);

  const statusMap = useMemo(() => {
    const map = {};
    statusTypes.forEach((status) => {
      if (status?._id) {
        map[status._id] = status;
      }
    });
    return map;
  }, [statusTypes]);

  const boardStatuses = useMemo(() => {
    const names = statusTypes.map((item) => normalizeStatus(item?.name)).filter(Boolean);
    return [...new Set(names)];
  }, [statusTypes]);

  const searchedIssues = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return issues;

    return issues.filter((issue) => {
      const issueKey = getIssueKey(issue).toLowerCase();
      const issueTitle = getIssueTitle(issue).toLowerCase();
      const projectName = getProject(issue).toLowerCase();

      return (
        issueKey.includes(keyword) ||
        issueTitle.includes(keyword) ||
        projectName.includes(keyword)
      );
    });
  }, [issues, search]);

  const visibleColumns = useMemo(() => {
    if (activeFilter === "ALL") return boardStatuses;
    return [activeFilter];
  }, [activeFilter, boardStatuses]);

  const groupedIssues = useMemo(() => {
    const grouped = {};

    boardStatuses.forEach((status) => {
      grouped[status] = [];
    });

    searchedIssues.forEach((issue) => {
      const status = getIssueStatus(issue, statusMap);
      if (!grouped[status]) {
        grouped[status] = [];
      }
      grouped[status].push(issue);
    });

    return grouped;
  }, [searchedIssues, boardStatuses, statusMap]);

  return (
    <div className="page-shell board-page-wrap">
      <div className="jira-board-header">
        <div>
          <div className="jira-board-breadcrumb">Board</div>
          <h1 className="page-title board-page-title">Issue Board</h1>
        </div>

        <div className="jira-board-header-right"></div>
      </div>

      <div className="board-top-toolbar">
  <div className="quick-filters-row">
    <span className="quick-filters-label">QUICK FILTERS:</span>

    <button
      className={`quick-filter-chip ${activeFilter === "ALL" ? "active" : ""}`}
      onClick={() => setActiveFilter("ALL")}
    >
      ALL
    </button>

    {boardStatuses.map((status) => (
      <button
        key={status}
        className={`quick-filter-chip ${activeFilter === status ? "active" : ""}`}
        onClick={() => setActiveFilter(status)}
      >
        {status}
      </button>
    ))}
  </div>

  <div className="board-toolbar">
    <input
      type="text"
      placeholder="Search issue..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="board-search-input"
    />

    <button className="board-refresh-btn" onClick={loadBoardData}>
      Refresh
    </button>
  </div>
</div>

      {loading && <div className="board-message">Đang tải issues...</div>}
      {!loading && error && <div className="board-error">{error}</div>}

      {!loading && !error && (
        <>
          <div className={`jira-columns-scroll ${activeFilter !== "ALL" ? "single-column" : ""}`}>
            {visibleColumns.map((column) => (
              <div className="jira-column" key={column}>
                <div className="jira-column-header">
                  <span>{column}</span>
                  <span>{groupedIssues[column]?.length || 0}</span>
                </div>

                <div className="jira-column-body">
                  {groupedIssues[column]?.length === 0 ? (
                    <div className="jira-empty-column">
                      Không có issue thuộc trạng thái {column}
                    </div>
                  ) : (
                    groupedIssues[column].map((issue) => (
                      <IssueCard
                        key={issue._id || issue.id || getIssueKey(issue)}
                        issue={issue}
                        statusMap={statusMap}
                        onClick={setSelectedIssue}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {activeFilter !== "ALL" && (
            <div className="board-filter-note">
              Đang lọc theo trạng thái: <strong>{activeFilter}</strong>
            </div>
          )}
        </>
      )}

      <IssueModal
        issue={selectedIssue}
        statusMap={statusMap}
        onClose={() => setSelectedIssue(null)}
      />
    </div>
  );
}