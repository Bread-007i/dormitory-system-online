export default function PageHeader({ title, subtitle, icon, action }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
      <div>
        <h1 className="h3 mb-1">
          {icon && <i className={`bi ${icon} me-2 text-primary`} />}
          {title}
        </h1>
        {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
