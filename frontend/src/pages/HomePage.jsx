import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="page-shell">
      <div className="page-breadcrumb">Home</div>
      <h1 className="page-title">TODO</h1>

      <div className="page-card home-card">
        <h2>Welcome</h2>
        <p className="page-muted">
          Đây là trang chính của hệ thống quản lý công việc.
        </p>
      </div>
    </div>
  );
}