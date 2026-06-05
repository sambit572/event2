import mongoose from "mongoose";
import "./loadEnv.js";

import { User } from "./model/user/user.model.js";
import Vendor from "./model/vendor/vendor.model.js";
import { Service } from "./model/vendor/service.model.js";
import Booking from "./model/common/booking.model.js";
import { UserBookingHistory } from "./model/user/userBookinghistory.model.js";
import VendorBooking from "./model/vendor/vendorBookingHistory.model.js";

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL;
    if (!mongoUri) {
      console.error("MONGODB_URL is missing!");
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected...");

    // Create Vendor
    const vendor = new Vendor({
      fullName: "Test Vendor",
      email: `vendor_${Date.now()}@test.com`,
      phoneNumber: `987654321${Math.floor(Math.random()*10)}`,
      password: "password123",
      registrationStatus: "completed",
      isRegistrationComplete: true
    });
    await vendor.save();
    console.log("Vendor created: ", vendor._id);

    // Create Service
    const service = new Service({
      vendorId: vendor._id,
      serviceCategory: "DJ Services & Brash Band",
      serviceName: "Premium DJ Set",
      duration: 4,
      stateLocationOffered: ["Delhi"],
      locationOffered: ["New Delhi"],
      serviceDes: "Best DJ set for your party",
      serviceImage: ["https://via.placeholder.com/150"],
      pricingType: "flat",
      minPrice: 5000,
      maxPrice: 15000,
    });
    await service.save();
    console.log("Service created: ", service._id);

    // Create User
    const user = new User({
      fullName: "Test User",
      email: `user_${Date.now()}@test.com`,
      phoneNo: `887654321${Math.floor(Math.random()*10)}`,
      password: "password123",
    });
    await user.save();
    console.log("User created: ", user._id);

    // Create Booking
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 5);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 5);
    endDate.setHours(endDate.getHours() + 4);

    const booking = new Booking({
      user: user._id,
      vendor: vendor._id,
      service: service._id,
      startDate: startDate,
      endDate: endDate,
      location: "Delhi Party Hall",
      amount: 10000,
      paymentStatus: "PAID",
      paymentMode: "ONLINE",
      paymentDate: new Date(),
      transactionId: "TXN_" + Date.now(),
      bookingStatus: "CONFIRMED"
    });
    await booking.save();
    console.log("Booking created: ", booking._id);

    // Try creating UserBookingHistory
    try {
        const userHistory = new UserBookingHistory({
            userId: user._id,
            userDetailsId: user._id, // Using user._id as a mock since we didn't create a separate UserDetails document
            booking: booking._id,
            vendorId: vendor._id,
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
        console.log("UserBookingHistory created.");
    } catch (err) {
        console.log("Failed to create UserBookingHistory. Schema might differ.", err.message);
    }
    
    // Try creating VendorBookingHistory
    try {
        const vendorHistory = new VendorBooking({
            vendor: vendor._id,
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
        console.log("VendorBookingHistory created.");
    } catch (err) {
         console.log("Failed to create VendorBookingHistory. Schema might differ.", err.message);
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database: ", error);
    process.exit(1);
  }
};

seedDatabase();
