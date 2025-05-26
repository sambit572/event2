const DJDetailsSection = () => {
  return (
    <div style={{ marginTop: "15px" }}>
      <h2 style={{ marginBottom: "10px" }}>DJ Details</h2>
      <p className="para1">DJ Name : Elegant Beats Wedding DJ Package</p>
      <p className="para1">
        Category : Event Entertainment / DJ Services
      </p>
      <p className="para1">
        Ideal For : Weddings, Engagements, Receptions
      </p>

      <h3 style={{ marginBottom: "10px", marginTop: "10px" }}>
        What’s Included:
      </h3>
      <ul>
        <li className="li">1 Professional Wedding DJ</li>
        <li className="li">1 MC Host (can be the DJ)</li>
        <li className="li">Sound System & Lights</li>
        <li className="li">Pre-Wedding Music Planning Call</li>
        <li className="li">Ceremony + Reception + Party Coverage</li>
      </ul>
    </div>
  );
};

export default DJDetailsSection;
