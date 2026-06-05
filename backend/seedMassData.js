import mongoose from "mongoose";
import "./loadEnv.js";

import { User } from "./model/user/user.model.js";
import Vendor from "./model/vendor/vendor.model.js";
import { Service } from "./model/vendor/service.model.js";
import Booking from "./model/common/booking.model.js";
import { UserBookingHistory } from "./model/user/userBookinghistory.model.js";
import VendorBooking from "./model/vendor/vendorBookingHistory.model.js";

const categories = ["Photography", "Videography", "Venue", "Decor", "Makeup", "Entertainment", "DJ", "Pandit", "Gifts", "Catering"];
const locations = ["Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad"];

const vendorNames = ["Elite Events", "Grand Occasions", "Royal Celebrations", "Crystal Decor", "Dream Moments"];
const userNames = ["Rahul Sharma", "Priya Singh", "Amit Patel", "Neha Gupta", "Vikram Malhotra", "Sneha Iyer", "Karan Johar", "Aditi Rao", "Siddharth Kapoor", "Pooja Hegde"];

const serviceNamesByCategory = {
  "Photography": ["Candid Wedding Photography Package", "Pre-wedding Cinematic Shoot", "Premium Traditional Photography"],
  "Videography": ["Cinematic Wedding Film 4K", "Drone & Traditional Video Coverage", "Engagement Ceremony Coverage"],
  "Venue": ["Grand Hyatt Banquet Hall", "Taj Palace Lawns", "Royal Heritage Resort"],
  "Decor": ["Floral & Marigold Traditional Mandap", "Modern LED & Crystal Reception Setup", "Bohemian Haldi & Mehendi Decor"],
  "Makeup": ["Bridal Airbrush Makeup Pro", "Party Makeup & Hair Styling", "HD Bridal Makeup Package"],
  "Entertainment": ["Live Sufi Band", "Classical Dance Troupe", "Stand-up Comedy & Emcee"],
  "DJ": ["Bollywood Celebrity DJ Night", "EDM & Commercial DJ Setup", "Sangeet Special DJ Mix"],
  "Pandit": ["Vedic Vivah Pandit Ji", "South Indian Wedding Priest", "North Indian Pujan Services"],
  "Gifts": ["Customized Wedding Hampers", "Silver Plated Return Gifts", "Gourmet Sweet Boxes"],
  "Catering": ["Premium North Indian Buffet", "Continental & Italian Live Counters", "Authentic South Indian Sadya"]
};

const serviceDescByCategory = {
  "Photography": ["Capture your beautiful moments with our award-winning candid photography team.", "High-quality, emotionally resonant photos that you will cherish forever."],
  "Videography": ["Relive your special day with a beautifully crafted cinematic film.", "Professional video coverage ensuring no moment is missed."],
  "Venue": ["Spacious and elegantly designed venue to host your grandest celebrations.", "A luxurious setting with top-notch amenities for a memorable event."],
  "Decor": ["Transform your venue with our breathtaking and customized decor setups.", "Elegant and thematic decorations that perfectly match your vision."],
  "Makeup": ["Flawless and long-lasting makeup to make you look your absolute best.", "Enhance your natural beauty with our professional makeup artists."],
  "Entertainment": ["Keep your guests entertained and engaged with our premium acts.", "Mesmerizing performances that add life to any party."],
  "DJ": ["Get everyone on the dance floor with our energetic and versatile DJ.", "Top-of-the-line sound systems and the best tracks for your event."],
  "Pandit": ["Experienced priests to perform all rituals with utmost devotion and authenticity.", "Ensure your ceremonies are conducted perfectly according to tradition."],
  "Gifts": ["Delight your guests with beautifully packaged and curated gifts.", "Thoughtful and elegant favors that leave a lasting impression."],
  "Catering": ["A culinary experience that your guests will talk about for years.", "Delicious, hygienic, and diverse menus customized to your taste."]
};

const generateRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL;
    if (!mongoUri) {
      console.error("MONGODB_URL is missing!");
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected...");

    // Optional: Clear existing seeded data to prevent clutter
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await UserBookingHistory.deleteMany({});
    await VendorBooking.deleteMany({});
    console.log("Existing data cleared.");

    const createdVendors = [];
    // Create 5 Vendors
    for (let i = 0; i < 5; i++) {
      const vendorName = vendorNames[i];
      const vendor = new Vendor({
        fullName: vendorName,
        email: `${vendorName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phoneNumber: `98${generateRandomInt(10000000, 99999999)}`,
        password: "password123",
        registrationStatus: "completed",
        isRegistrationComplete: true
      });
      await vendor.save();
      createdVendors.push(vendor);
      console.log(`Vendor created: ${vendorName}`);
    }

    const createdServices = [];
    // Create 20 Services (4 per vendor)
    for (let i = 1; i <= 20; i++) {
      const vendor = getRandomItem(createdVendors);
      const category = getRandomItem(categories);
      const isCatering = category === "Catering";
      
      const serviceNameOptions = serviceNamesByCategory[category] || [`${category} Premium Service`];
      const serviceName = getRandomItem(serviceNameOptions);

      const serviceDescOptions = serviceDescByCategory[category] || ["High quality and reliable service."];
      const serviceDes = getRandomItem(serviceDescOptions);
      
      const serviceData = {
        vendorId: vendor._id,
        serviceCategory: category,
        serviceName: serviceName,
        duration: generateRandomInt(2, 12),
        stateLocationOffered: [getRandomItem(locations)],
        locationOffered: [getRandomItem(locations)],
        serviceDes: serviceDes,
        serviceImage: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600"], // Better placeholder image
        pricingType: isCatering ? "perPlate" : "flat",
      };

      if (isCatering) {
        serviceData.perPlatePrice = generateRandomInt(500, 3000);
        serviceData.minPlates = generateRandomInt(50, 100);
        serviceData.maxPlates = generateRandomInt(500, 2000);
      } else {
        const minP = generateRandomInt(5000, 20000);
        serviceData.minPrice = minP;
        serviceData.maxPrice = minP + generateRandomInt(10000, 50000);
      }

      const service = new Service(serviceData);
      await service.save();
      createdServices.push(service);
      console.log(`Service created: ${serviceName} (Category: ${category})`);
    }

    const createdUsers = [];
    // Create 10 Users
    for (let i = 0; i < 10; i++) {
      const userName = userNames[i];
      const user = new User({
        fullName: userName,
        email: `${userName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phoneNo: `88${generateRandomInt(10000000, 99999999)}`,
        password: "password123",
      });
      await user.save();
      createdUsers.push(user);
      console.log(`User created: ${userName}`);
    }

    // Create 30 Bookings
    const statuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
    const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

    for (let i = 1; i <= 30; i++) {
      const user = getRandomItem(createdUsers);
      const service = getRandomItem(createdServices);
      const vendorId = service.vendorId;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + generateRandomInt(1, 60));
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + service.duration);

      const bookingStatus = getRandomItem(statuses);
      const paymentStatus = getRandomItem(paymentStatuses);

      const location = `${getRandomItem(locations)} Grand Resort`;

      const booking = new Booking({
        user: user._id,
        vendor: vendorId,
        service: service._id,
        startDate: startDate,
        endDate: endDate,
        startDateNormalized: startDate,
        endDateNormalized: endDate,
        location: location,
        amount: service.pricingType === "flat" ? service.minPrice : service.perPlatePrice * 200, // assume 200 plates for catering booking
        paymentStatus: paymentStatus,
        paymentMode: "ONLINE",
        paymentDate: new Date(),
        transactionId: "TXN" + Date.now() + "XY" + i,
        bookingStatus: bookingStatus,
        isReviewed: false,
        isNotified: true
      });
      await booking.save();
      console.log(`Booking ${i} created for ${user.fullName} -> ${service.serviceName}`);

      try {
        const userHistory = new UserBookingHistory({
            userId: user._id,
            userDetailsId: user._id,
            booking: booking._id,
            vendorId: vendorId,
            bookingStatus: booking.bookingStatus,
            paymentStatus: booking.paymentStatus,
            amount: booking.amount,
            serviceName: service.serviceName,
            serviceImage: service.serviceImage[0],
            location: booking.location,
            startDate: booking.startDate,
            endDate: booking.endDate
        });
        await userHistory.save();
      } catch (err) {}

      try {
        const vendorHistory = new VendorBooking({
            vendor: vendorId,
            service: service._id,
            booking: booking._id,
            user: user._id,
            bookingStatus: booking.bookingStatus,
            paymentStatus: booking.paymentStatus,
            amount: booking.amount,
            serviceName: service.serviceName,
            location: booking.location,
            startDate: booking.startDate,
            endDate: booking.endDate
        });
        await vendorHistory.save();
      } catch (err) {}
    }

    console.log("Database successfully seeded with meaningful mass data!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database: ", error);
    process.exit(1);
  }
};

seedDatabase();
