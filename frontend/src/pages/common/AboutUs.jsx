import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import AboutUs_1 from "../../assets/home/AboutUs_1.jpeg";
import Aboutus_2 from "../../assets/home/Aboutus_2.png";
import Design from "../../components/common/aboutus/Design";
import ServiceFeature from "./ServiceFeature";
import frame from "../../assets/home/frame_image.png";

const Card = ({ title, description, image }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 hover:shadow-2xl transition-all duration-300 ease-in-out">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <img src={image} alt={title} className="w-16 h-16 object-cover rounded-md" />
        <div className="flex justify-between items-center w-full">
          <h3 className="text-lg font-semibold text-[#001f3f]">{title}</h3>
          <FiChevronDown
            className={`text-xl transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </div>
      <div
        className={`transition-all duration-300 overflow-hidden mt-3 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        {open && (
          <p className="text-gray-700 text-sm leading-relaxed mt-3">{description}</p>
        )}
      </div>
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="bg-transparent text-gray-800 px-4 sm:px-6 md:px-10 py-10 space-y-20">
      {/* First Section */}
      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* Left - Image Section */}
        <div className="w-full lg:w-1/2">
          <img
            src={AboutUs_1}
            alt="About Eventsbridge Platform"
            className="w-full h-[520px] object-cover mt-15 rounded-xl border border-gray-200 shadow-lg"
          />
        </div>

        {/* Right - Textual Content */}
        <div className="w-full lg:w-1/2 space-y-5">
          <h2 className="text-3xl font-bold text-[#001f3f]">Information About Eventsbridge</h2>
          <p className="text-gray-700 text-base md:text-lg">
            Eventsbridge is a cutting-edge digital platform created to revolutionize the way events are planned and experienced. Whether you're hosting a wedding, birthday, corporate function, or cultural ceremony — our platform connects customers with the most reliable and talented vendors in the industry.
          </p>
          <p className="text-gray-700 text-sm md:text-base">
            The platform is designed to remove the stress and guesswork from event management. With our intuitive interface, you can search, compare, and book vendors across multiple categories — all from one place.
          </p>

          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1" />
              <span>
                <strong>For Vendors:</strong> Expand visibility, receive real-time leads, and manage bookings efficiently.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1" />
              <span>
                <strong>For Customers:</strong> Discover, evaluate, and book trusted services confidently with reviews and transparent pricing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-green-500 mt-1" />
              <span>
                <strong>Admin Recommendations:</strong> Get curated vendor suggestions based on your event type, location, and preferences.
              </span>
            </li>
          </ul>
        </div>
      </div>


      <Design />

      {/* Services Section */}
      <div className="text-center mt-10">
        <h2 className="text-3xl font-bold text-[#001f3f] mb-3">Our Event Services</h2>
        <p className="text-gray-600 text-base md:text-lg mb-10">
          Explore a wide range of services tailored to create memorable experiences for every occasion.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-10 mt-10">
        <ServiceFeature
          title="Music & Entertainment"
          features={[
            'Make your event unforgettable with heart-thumping beats, soulful melodies, and spectacular performances. Whether you are planning a lively sangeet, an elegant cocktail evening, or a full-blown baraat, our curated list of DJs, live bands, orchestras, and performers ensures your guests stay entertained from start to finish',
            'DJs',
            'Brass bands',
            'Regional bands',
          ]}
          icon="🎵"
          image="https://images.unsplash.com/photo-1496337589254-7e19d01cec44?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0"
          reverse
        />
        <ServiceFeature
          title="Decor & Setup"
          features={[
            'Transform your venue into a visual masterpiece. From intimate gatherings to extravagant celebrations, we provide stunning tent setups, floral arrangements, and personalized themes that match your cultural heritage or modern aesthetic. Let every detail speak your story',
            'Tenthouse and themed decorations',
            'Flower decorators',
            'Personalized setups',
          ]}
          icon="🎀"
          image="https://media.istockphoto.com/id/471906412/photo/beautiful-table-setting-for-an-wedding-reception-or-an-event.webp?a=1&b=1&s=612x612&w=0&k=20&c=wrF199YjsZWmbQSqGGiA8LojD7qz602jbfoymHlYiZ4="
        />
        <ServiceFeature
          title="Culinary Delights"
          features={[
            'A memorable event is never complete without delicious food. Choose from a wide array of premium catering services offering traditional regional dishes, international cuisines, and live counters. Whether it is a multi-course banquet or a fusion buffet, we serve experiences worth savoring',
            'Premium catering services',
            'Live counters and buffets',
          ]}
          icon="🍽"
          image="https://images.unsplash.com/photo-1555244162-803834f70033"
          reverse
        />
        <ServiceFeature
          title="Capture Moments"
          features={[
            'Every smile, every emotion, every ritual — captured beautifully. Our professional photographers and videographers ensure that none of your special moments go undocumented. From cinematic wedding films to candid portraits, relive your big day through the lens of creativity',
            'Cinematic wedding films',
            'Candid portraits',
          ]}
          icon="📸"
          image="https://images.unsplash.com/photo-1629756048377-09540f52caa1"
        />
        <ServiceFeature
          title="Religious Services"
          features={[
            'From traditional Hindu rituals to Christian or Islamic ceremonies, we connect you with experienced and authentic religious officiants. Whether it is a wedding, engagement, or house blessing, get guidance and blessings according to your faith and customs',
            'Pandits',
            'Fathers',
            'Maulvis',
          ]}
          icon="🛐"
          image={frame}
          reverse
        />
        <ServiceFeature
          title="Beauty & Grooming"
          features={[
            'Shine on your big day with our expert makeup artists and stylists. From traditional bridal looks to contemporary glam, we offer personalized grooming services for brides, grooms, and families. Do not forget the mehendi — intricate, vibrant, and full of culture',
            'Professional makeup artists',
            'Mehendi artists',
          ]}
          icon="💄"
          image="https://media.istockphoto.com/id/1336649728/photo/beautiful-traditional-indian-bride-getting-ready-for-her-wedding-day-by-makeup-artist.webp?a=1&b=1&s=612x612&w=0&k=20&c=t2hJwSM7oSHz9BkmBiqAf18ktvwy4lCT5W22fOLMmN0="
        />
        <ServiceFeature
          title="Grand Entries"
          features={[
            'Make a statement from the moment you arrive. Whether it is a royal horse carriage, a decked-out luxury car, or a themed groom entry, we help you plan an entrance that leaves your guests speechless — and your memories unforgettable',
            'Horse carts',
            'Luxury cars',
          ]}
          icon="🚗"
          image="https://images.unsplash.com/photo-1721994234246-45087e5aca16"
          reverse
        />
        <ServiceFeature
          title="Special Effects"
          features={[
            'Add magic to your event with pyrotechnics, cold fireworks, fog machines, or sparkling entries. Our special effects services add that dramatic flair and cinematic charm to your celebration, making every moment Instagram-worthy',
            'Cold fireworks',
            'Sparkling entries',
          ]}
          icon="🎆"
          image="https://media.istockphoto.com/id/697445308/photo/videographer-is-shooting-bridal-event-in-the-fireworks.webp?a=1&b=1&s=612x612&w=0&k=20&c=oESbBmyGwIEwe2sa5j-YARVaSEoRygYWHe1aTyxLhRg="
        />
      </div>
    </div>
  );
};

export default AboutUs;
