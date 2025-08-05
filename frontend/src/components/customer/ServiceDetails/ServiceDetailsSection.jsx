import "./ServiceDetailsSection.css";

const ServiceDetailsSection = ({ title, category, idealFor, inclusions }) => {
  return (
    <div className="dj-details">
      <h2>Service Details</h2>
      <p className="para1">
        <strong>Service Name:</strong> {title}
      </p>
      <p className="para1">
        <strong>Category:</strong> {category}
      </p>
      <p className="para1">
        <strong>Ideal For:</strong> {idealFor}
      </p>

      <h3>What’s Included:</h3>
      <ul className="details-list">
        {inclusions && inclusions.length > 0 ? (
          inclusions.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          <li>No details provided.</li>
        )}
      </ul>
    </div>
  );
};

export default ServiceDetailsSection;
