const PageHeader = ({ title, subtitle }) => (
  <div className="bg-gradient-to-r from-primary-500 to-primary-700 py-10">
    <div className="container-custom text-white">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-orange-100 mt-1">{subtitle}</p>}
    </div>
  </div>
)

export default PageHeader