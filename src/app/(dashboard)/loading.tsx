export default function DashboardLoading() {
  return (
    <div className="page-content">
      <div className="skeleton" style={{ height: 32, width: '40%', borderRadius: 10, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 16, width: '60%', borderRadius: 8, marginBottom: 28 }} />
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />
        ))}
      </div>
      <div className="skeleton" style={{ height: 200, borderRadius: 16, marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 120, borderRadius: 16 }} />
    </div>
  );
}
