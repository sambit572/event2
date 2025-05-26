import { BsCurrencyRupee } from "react-icons/bs";
import { IoIosStar } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6"; // or "react-icons/fa" depending on your version



const SimilarProductCard = ({ product }) => (
  <div className="similar-img2">
    <div className="image">
      <img src={product.image} alt="Similar Product" />
    </div>
    <div style={{ padding: "8px" }}>
      <h3>Wedding DJ Service</h3>
      <div className="price">
        <div className="rupee">
          <div
            style={{
              fontWeight: "bold",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              fontSize: "20px",
              marginLeft: "20px",
            }}
          >
            <BsCurrencyRupee style={{ fontSize: "17px" }} />
            <span>{product.price}</span>
          </div>
        </div>

        <div className="rupee1">
          <div
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              fontSize: "20px",
              marginLeft: "15px",
            }}
          >
            <BsCurrencyRupee style={{ fontSize: "13px" }} />
            <span style={{ fontSize: "13px" }}>{product.originalPrice}</span>
          </div>
        </div>

        <h2
          style={{
            color: "green",
            marginLeft: "17px",
            textAlign: "center",
            fontSize: "17px",
          }}
        >
          40% off
        </h2>
      </div>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        marginLeft: "10px",
      }}
    >
      <div className="rating">
        <div>{product.rating}</div>
        <div>
          <IoIosStar />
        </div>
      </div>
      <span style={{ color: "black", fontSize: "17px", fontWeight: "400" }}>
        {product.reviews} reviews
      </span>
    </div>

    <button className="add-to-cart1">
      <FaCartShopping style={{ marginRight: "8px" }} />
      Add To Cart
    </button>
  </div>
);

export default SimilarProductCard;
