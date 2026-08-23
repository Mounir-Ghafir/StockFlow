const PageHeader = ({ eyebrow, title, description, action }) => (
  <header className="page-header">
    <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>
    {action}
  </header>
);

export default PageHeader;
