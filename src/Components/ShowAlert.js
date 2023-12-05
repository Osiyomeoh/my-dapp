import React from "react";

function AlertComponent({ message, type, onClose }) {
    let backgroundColorClass;
    switch (type) {
      case 'success':
        backgroundColorClass = 'bg-green-500'; // Adjusted to a darker green
        break;
      case 'error':
        backgroundColorClass = 'bg-red-500'; // Adjusted to a darker red
        break;
      default:
        backgroundColorClass = 'bg-blue-500'; // Adjusted to a darker blue
    }

    return (
      <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 p-4 rounded ${backgroundColorClass} text-white`}>
        <p>{message}</p>
        <button onClick={onClose} className="mt-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow">
          Close
        </button>
      </div>
    );
}

export default AlertComponent;
