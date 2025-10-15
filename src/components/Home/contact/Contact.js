import React from "react";
import {
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Contact = () => {
  return (
    <div className="w-full min-h-screen flex justify-center bg-white" id="contact">
      <div className="w-[92%]  mx-auto border-l-4 border-r-4 border-gray-100 flex flex-col items-center justify-center  px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
          Get in Touch
        </h2>
        <p className="text-gray-600 text-center max-w-xl mb-8">
          Have questions or want to work together? Fill out the form or reach us
          using the info below. We'll get back to you as soon as possible.
        </p>

        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <form className="w-full bg-gray-50 p-6 rounded-2xl shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Message
              </label>
              <textarea
                placeholder="Your message"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={6}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white font-semibold py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info + Map */}
          <div className="w-full flex flex-col justify-center bg-gray-50 p-6 rounded-2xl shadow-md space-y-6">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-purple-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Address</h2>
                <p className="text-gray-600">
                  123 Mindloop Street, Innovation City, 45678
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaEnvelope className="text-purple-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Email</h2>
                <p className="text-gray-600">hello@mindloop.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaPhone className="text-purple-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Phone</h2>
                <p className="text-gray-600">+1 (234) 567-890</p>
              </div>
            </div>

            {/* Social Icons */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Follow Us
              </h2>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-purple-500 transform hover:scale-110 transition-all"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-purple-500 transform hover:scale-110 transition-all"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-purple-500 transform hover:scale-110 transition-all"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>

            {/* Map Embed */}
            <div className="w-full h-64 rounded-2xl overflow-hidden mt-4">
              <iframe
                title="Mindloop Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0196191370937!2d-122.41941508468183!3d37.77492977975909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085815c0c8e7b63%3A0x2d0c6d0c6d0c6d0c!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1695531000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                className="border-0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
