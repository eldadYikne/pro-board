import React, { useState } from "react";
import Board1 from "../assets/board1.png";
import { WhatsApp } from "@mui/icons-material";
function KHomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [iphoneImg, setIphoneImg] = useState("edit1");

  const messages = [
    { text: "מסך לניהול זמנים", image: "board1" },
    { text: "מסך לאיחולים", image: "board2" },
  ];
  const abilities = [
    " ניהול מידע בצורה קלה",
    " תמיכה במגוון פורמטים",
    " ממשק משתמש אינטואיטיבי",
    " גישה מכל מקום",
  ];
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % messages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + messages.length) % messages.length);
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 min-h-screen flex flex-col justify-center items-center text-white relative overflow-hidden">
      <header className="text-center mb-8">
        <h1 className="text-5xl mt-4 font-extrabold drop-shadow-lg">
          קודש בורד
        </h1>
        <p className="text-xl mt-4">ברוכים הבאים לפורטל הקדוש שלך</p>
      </header>

      <main className="text-center z-10">
        <p className="text-lg mb-6">
          כאן תוכלו לנהל ולצפות במידע חשוב בצורה קלה ונוחה.
        </p>

        <button className="bg-white text-purple-700 py-3 px-6 rounded-full shadow-lg hover:bg-gray-200 transition duration-300">
          <a
            target="_blank"
            className="flex justify-center gap-2 items-center"
            href="https://wa.me/+972526587480/?text=שלום%20,%20אני%20רוצה%20לשמוע%20פרטים%20לגבי%20קודש%20בורד"
          >
            <span>התחל עכשיו</span>
            <WhatsApp />
          </a>
        </button>
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">מה אנחנו מציעים?</h2>
          <div className="flex justify-center w-full">
            <div className="flex flex-col items-start ">
              {abilities.map((ability, index) => (
                <div
                  className="flex items-start gap-2 mb-4 relative"
                  key={index}
                >
                  {/* SVG Arrow */}
                  <svg
                    className="w-6 h-6 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2l1.41 1.41L6.83 10H22v2H6.83l6.59 6.59L12 22l-10-10z"
                    />
                  </svg>
                  <p className="text-lg">{ability}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 w-full max-w-md relative">
          <h2 className="text-2xl font-bold mb-1">המסכים שלנו</h2>

          <div className="overflow-hidden rounded-lg  px-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`w-full flex justify-center transition-transform duration-500 ease-in-out transform ${
                  index === currentSlide ? "translate-x-0" : "translate-x-full"
                }`}
                style={{ display: index === currentSlide ? "block" : "none" }}
              >
                <div className="w-full flex justify-center">
                  <div className="bg-transparent px-4 py-1 rounded-lg  relative max-w-sm mx-auto">
                    <p className="legend my-2">{message.text}</p>
                    <div className="bg-black mx-3 rounded-t-lg border-b-4 border-gray-700">
                      <div className="bg-gray-900 p-4 rounded-t-lg text-center text-white">
                        <span className="absolute left-[43%] text-[7px] bottom-0  text-white p-2 shadow-lg ">
                          {" "}
                          SAMSUNG
                        </span>
                        <img
                          src={require("../assets/" + message.image + ".png")}
                          alt={`WhatsApp Message ${index + 1}`}
                          className="w-full h-[220px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="absolute left-2 top-[60%] transform -translate-y-1/2 bg-white text-purple-700 p-2 rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
            onClick={prevSlide}
          >
            &#10095;
          </button>

          <button
            className="absolute right-2 top-[60%] transform -translate-y-1/2 bg-white text-purple-700 p-2 rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
            onClick={nextSlide}
          >
            &#10094;
          </button>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-2xl font-bold mb-1">ערוך מכל מקום</h2>

          <div className="flex justify-center items-center">
            <div className="relative w-2/3 h-96 bg-black rounded-[36px] shadow-lg overflow-hidden">
              {/* Screen Background */}
              <div
                style={{
                  background: `url(${require(`../assets/${iphoneImg}.png`)}) no-repeat`,
                  backgroundSize: "cover ",
                }}
                className="!bg-cover flex justify-center items-center p-3 absolute inset-0 m-2 bg-black rounded-[36px] "
              ></div>

              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-black rounded-full shadow-md"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black rounded-full shadow-md"></div>

              {/* Bottom Edge */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 mb-[1px] bg-gray-300 rounded-full"></div>

              {/* Speaker */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-gray-200 z-10">
        <p>© 2024 קודש בורד. כל הזכויות שמורות.</p>
      </footer>

      <div className="absolute top-0 left-0 w-64 h-64">
        <svg
          className="w-full h-full text-white opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-48 h-48">
        <svg
          className="w-full h-full text-white opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
        </svg>
      </div>

      <div className="absolute sm:bottom-0 bottom-[-55px] left-0 w-full">
        <svg
          className="w-full h-48"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,288L48,272C96,256,192,224,288,186.7C384,149,480,107,576,122.7C672,139,768,213,864,234.7C960,256,1056,224,1152,218.7C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}

export default KHomePage;
