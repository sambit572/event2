import "./CategoryCard.css";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  // console.log("category.title", category.title);
  return (
    <div
      className="courseCard"
      onClick={() => {
        navigate(`/category/${category.title}`, {
          state: { category }, // ✅ pass full category object
        });
      }}
    >
      <span className="brandLabel">EventsBridge</span>

      <div className="imageWrapper">
        <img
          loading="lazy"
          decoding="async"
          src={category.image.src}
          srcSet={category.image.srcSet}
          sizes=" (max-width: 640px) 90vw, (max-width: 1024px) 45vw, 360px"
          width={400} // known width
          height={300} // known height
          alt={category.title}
          className="courseImage"
        />

        {/* Dark Blur Overlay + Tagline */}
        {category.tagline && (
          <div className="taglineOverlay">
            <span className="taglineText">{category.tagline}</span>
          </div>
        )}
      </div>

      <div className="courseContent">
        <h3 className="courseTitle">
          {/* <span className="courseIcon">{category.icon}</span> */}
          <span className="courseText">{category.title}</span>
        </h3>

        {/* Tagline visible only in mobile/tablet */}
        {category.tagline && (
          <p className="courseTaglineResponsive">{category.tagline}</p>
        )}

        {/* {category.badge && (
          <span className={`courseTag ${category.badge.toLowerCase()}`}>
            {category.badge}
          </span>
        )} */}
      </div>
    </div>
  );
};

export default CategoryCard;
