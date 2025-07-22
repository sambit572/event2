import dj from "../../../assets/service/djImg/dj-img 2.jpg"
import band from "../../../assets/service/band-img/band-7.webp"
import cat from "../../../assets/service/catering/catering1.jpeg"
import photo from "../../../assets/service/photographer/camera2.jpg"
import tent from "../../../assets/service/tent-img/tent1.jpg"

const CartData = [
  {
    id: "band1",
    name: "Geet Jhankar Musical Brass Band",
    vendor: "Aarav Mehta",
    location: "Patia, Bhubaneswar, Odisha - 123344",
    rating: 4.5,
    reviewsCount: 4000,
    price: 30000,
    originalPrice: 60000,
    discountPercent: 50,
    description:
      "A top-tier brass and orchestra band offering wedding processions, bhajan performances, and festive orchestras.",
    image: [band],
  },
  {
    id: "dj1",
    name: "Electro Beats DJ Services",
    vendor: "Ravi Sharma",
    location: "MG Road, Bangalore, Karnataka - 560001",
    rating: 4.7,
    reviewsCount: 2200,
    price: 20000,
    originalPrice: 25000,
    discountPercent: 20,
    description:
      "Dynamic DJ service with latest sound systems and lighting for weddings, parties, and corporate events.",
    image:[dj],
  },
  {
    id: "cat1",
    name: "Shuddh Bhojan Veg Catering",
    vendor: "Neha Caterers",
    location: "Bapunagar, Ahmedabad, Gujarat - 380024",
    rating: 4.4,
    reviewsCount: 1500,
    price: 600,
    originalPrice: 800,
    discountPercent: 25,
    description:
      "Pure vegetarian catering service offering traditional and modern dishes for all occasions.",
    image:[cat],
  },
  {
    id: "photo1",
    name: "Moments Captured Photography",
    vendor: "Pratik Sinha",
    location: "Salt Lake, Kolkata, West Bengal - 700091",
    rating: 4.8,
    reviewsCount: 3100,
    price: 5000,
    originalPrice: 7000,
    discountPercent: 29,
    description:
      "Professional candid photography service for weddings, pre-wedding shoots, and family functions.",
    image: [photo],
  },
  {
    id: "dec1",
    name: "Royal Wedding Stage Decor",
    vendor: "Elegant Events",
    location: "Gomti Nagar, Lucknow, Uttar Pradesh - 226010",
    rating: 4.6,
    reviewsCount: 1800,
    price: 3000,
    originalPrice: 5000,
    discountPercent: 40,
    description:
      "Luxurious floral and light-based stage decorations for wedding receptions and cultural functions.",
    image: [tent],
  }
];

export default CartData;
