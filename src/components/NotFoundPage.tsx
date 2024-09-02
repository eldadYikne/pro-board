import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">
        אופסס הגעת לעמוד לא קיים
      </h1>
      <a
        href="https://wa.me/972526587480/?text=היי%20אני%20צריך%20עזרה%20הגעתי%20לקישור%20לא%20נכון"
        className="bg-green-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-600 transition duration-300"
      >
        היי אני צריך עזרה הגעתי לקישור לא נכון
      </a>
    </div>
  );
};

export default NotFoundPage;
