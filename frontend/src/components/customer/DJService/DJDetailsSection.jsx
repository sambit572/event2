import "../DJService/DJDetailsSection.css"; // Ensure CSS is imported

const DJDetailsSection = () => {
  return (
    <div className="dj-details">
      <h2>DJ Details</h2>
      <p className="para1">DJ Name: Elegant Beats Wedding DJ Package</p>
      <p className="para1">Category: Event Entertainment / DJ Services</p>
      <p className="para1">Ideal For: Weddings, Engagements, Receptions</p>

      <h3>What’s Included:</h3>
      <ul className="details-list">
        <li>1 Professional Wedding DJ</li>
        <li>1 MC Host (can be the DJ)</li>
        <li>Sound System & Lights</li>
        <li>Pre-Wedding Music Planning Call</li>
        <li>Ceremony + Reception + Party Coverage</li>
      </ul>
    </div>
  );
};

export default DJDetailsSection;
