import React, { useState } from 'react';
import {
  FaEnvelope,
  FaPhoneAlt,
  FaComments,
} from 'react-icons/fa';


const HelpCenter = () => {
  const [language, setLanguage] = useState("en");

  const content = {
    en: {
      heading: "Welcome to the Help Center",
      sub: "Need help? Feel free to chat or call us anytime!",
      chatTitle: "Chat with us",
      chatDesc:
        "Our chat help will quickly solve issues related to your orders, payments, delivery & much more.",
      chatBtn: "Start Chatting now →",
      callTitle: "Call us now",
      callDesc: 'Want to talk to us about your recent orders? Click the “Need help” button.',
      callNo: "+91 1234567890",
      emailTitle: "Email now",
      emailDesc: "Have questions about your booking? Click the “Send” button.",
      emailId: "support@example.com",
      emailBtn: "Send →",
      callBtn: "Need Help →",
    },
    hi: {
      heading: "सहायता केंद्र में आपका स्वागत है ",
      sub: "क्या आपको मदद चाहिए? कभी भी चैट या कॉल करें!",
      chatTitle: "हमसे चैट करें",
      chatDesc:
        "हमारी चैट सहायता आपके ऑर्डर, भुगतान, डिलीवरी आदि से जुड़े मुद्दों को तुरंत हल करेगी।",
      chatBtn: "अभी चैट शुरू करें →",
      callTitle: "हमें अभी कॉल करें",
      callDesc: "अपने हालिया ऑर्डर के बारे में बात करनी है? 'मदद चाहिए' पर क्लिक करें।",
      callNo: "+91 1234567890",
      emailTitle: "अभी ईमेल करें",
      emailDesc: "क्या आपकी बुकिंग से संबंधित कोई प्रश्न है? 'भेजें' बटन पर क्लिक करें।",
      emailId: "support@example.com",
      emailBtn: "भेजें →",
      callBtn: "मदद चाहिए →",
    },
    ta: {
      heading: "உதவி மையத்திற்கு வரவேற்கிறோம் 🖤",
      sub: "உங்களுக்கு உதவி தேவைப்படுகிறதா? எங்களை எப்போதும் தொடர்பு கொள்ளலாம்!",
      chatTitle: "எங்களுடன் அரட்டையடிக்கவும்",
      chatDesc:
        "உங்கள் ஆர்டர், கட்டணம், டெலிவரி போன்றவற்றை எளிதாகத் தீர்க்க எங்கள் அரட்டை உதவிக்கு தயாராக இருக்கின்றது.",
      chatBtn: "இப்போது அரட்டையைத் தொடங்குங்கள் →",
      callTitle: "எங்களை அழைக்கவும்",
      callDesc: "உங்கள் சமீபத்திய ஆர்டர்களைப் பற்றி பேச விரும்புகிறீர்களா? “உதவி தேவை” என்பதை கிளிக் செய்யவும்.",
      callNo: "+91 1234567890",
      emailTitle: "இப்போது மின்னஞ்சல் செய்யவும்",
      emailDesc: "உங்கள் முன்பதிவை பற்றி கேள்விகள் உள்ளனவா? 'அனுப்பு' பொத்தானைக் கிளிக் செய்யவும்.",
      emailId: "support@example.com",
      emailBtn: "அனுப்பவும் →",
      callBtn: "உதவி தேவை →",
    },
    or: {
      heading: "ସହଯୋଗ କେନ୍ଦ୍ରକୁ ସ୍ବାଗତ",
      sub: "ମଦଦ ଆବଶ୍ୟକ? ଯେକୌଣସି ସମୟରେ ଆମ ସହିତ ଚାଟ କିମ୍ବା କଲ୍ କରନ୍ତୁ!",
      chatTitle: "ଆମ ସହିତ ଚାଟ କରନ୍ତୁ",
      chatDesc:
        "ଆପଣଙ୍କର ଅର୍ଡର୍, ପେମେଣ୍ଟ, ଡିଲିଭେରି ଇତ୍ୟାଦି ସମସ୍ୟାଗୁଡ଼ିକୁ ଶୀଘ୍ର ସମାଧାନ ପାଇଁ ଆମ ଚାଟ୍ ସହଯୋଗ ଉପଲବ୍ଧ ଅଛି।",
      chatBtn: "ଏବେ ଚାଟ୍ ଆରମ୍ଭ କରନ୍ତୁ →",
      callTitle: "ଆମକୁ କଲ୍ କରନ୍ତୁ",
      callDesc: "ଆପଣଙ୍କର ଅତି ନିକଟର ଅର୍ଡର୍ ବିଷୟରେ କଥାହେବାକୁ ଚାହୁଁଛନ୍ତି? 'ମଦଦ ଆବଶ୍ୟକ' ବଟନ୍ କ୍ଲିକ୍ କରନ୍ତୁ।",
      callNo: "+91 1234567890",
      emailTitle: "ଏବେ ଇମେଲ୍ କରନ୍ତୁ",
      emailDesc: "ଆପଣଙ୍କର ବୁକିଂ ସଂପର୍କରେ ପ୍ରଶ୍ନ ଅଛି କି? 'ପଠାନ୍ତୁ' ବଟନ୍ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ।", 
      emailId: "support@example.com",
      emailBtn: "ପଠାନ୍ତୁ →",
      callBtn: "ମଦଦ ଆବଶ୍ୟକ →",
    },

  };

  return (
    <div className="bg-[#fefcff] min-h-screen py-12 px-4 md:px-20">
      <div className="max-w-6xl mx-auto">

        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className=" bg-[#f7f7f7] text-[#001f3f] ml-5 mr-5 border border-black-700 text-left  rounded  py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="or">ଓଡ଼ିଆ (Odia)</option>
          </select>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#001f3f]">{content[language].heading}</h1>
          <p className="text-[#001f3f] mt-3 text-lg">{content[language].sub}</p>
        </div>

        {/* Chat and Call Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Chat */}
          <div className="bg-[#f7f7f7] p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FaComments className="text-green-600 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-[#001f3f]">
                {content[language].chatTitle}
              </h2>
            </div>
            <p className="text-[#001f3f] mb-4">{content[language].chatDesc}</p>
            <div className='flex justify-center'>
            <button className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 transition">
              {content[language].chatBtn}
            </button>
            </div>
          </div>

          {/* Call */}
          <div className="bg-[#f7f7f7] p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaPhoneAlt className="text-blue-600 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-[#001f3f]">
                {content[language].callTitle}
              </h2>
            </div>
            <p className="text-[#001f3f] mb-4">{content[language].callDesc}</p>
            <div className='text-blue-700 text-base mb-1 mt-[-2px]'>{content[language].callNo}</div>
            <div className="flex justify-center">
              <button className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition">
                {content[language].callBtn}
              </button>
            </div>
          </div>
          {/* Call */}
          <div className="bg-[#f7f7f7] p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <FaEnvelope className="text-purple-600 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-[#001f3f]">
                {content[language].emailTitle}
              </h2>
            </div>
            <p className="text-[#001f3f] mb-4">{content[language].emailDesc}</p>
            <div className='text-purple-700 text-base mb-1 mt-[-2px]'>{content[language].emailId}</div>
            <div className='flex justify-center'>
            <button className="bg-purple-500 text-white px-5 py-2 rounded hover:bg-purple-600 transition">
              {content[language].emailBtn}
            </button>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-0 py-10">
          <div className="md:grid-cols-3 gap-6 text-center">

            {/* Email Option */}
            {/* <div className="bg-white ml-[300px] p-6 justify-center w-[500px] rounded-xl shadow-md hover:shadow-xl transition-all">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-purple-100 text-purple-700 p-4 rounded-full">
              <FaEnvelope className="text-2xl" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Email us</h3>
          <p className="text-sm text-gray-600">
            Write to us at{" "}
            <a
              href="mailto:support@example.com"
              className="text-purple-600 underline hover:text-purple-800"
            >
             support@example.com
            </a>
          </p>
        </div> */}



          </div>
        </div>


      </div>
    </div>
  );
};

export default HelpCenter;
