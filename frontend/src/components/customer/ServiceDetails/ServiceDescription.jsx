import "./ServiceDescription.css";

const ServiceDescription = ({ description }) => {
  return (
    <div className="description-section">
      {description ? (
        <p className="description-text">{description}</p>
      ) : (
        <p className="description-text placeholder">No description available.</p>
      )}
    </div>
  );
};

export default ServiceDescription;
