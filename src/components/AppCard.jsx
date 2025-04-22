// src/components/AppCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const AppCard = ({ app }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-4">
        <div className="w-16 h-16 mx-auto mb-4">
          <img
            src={app.icon}
            alt={`${app.name} icon`}
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
          {app.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 text-center">
          {app.description}
        </p>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {app.features.map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
        <Link
          to={`/app/${app.id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          Launch App
        </Link>
      </div>
    </div>
  );
};

AppCard.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default AppCard;