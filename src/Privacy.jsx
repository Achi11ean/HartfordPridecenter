import React from "react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 text-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-black/40 border-2 border-pink-400 rounded-2xl shadow-2xl p-6 sm:p-10 backdrop-blur-md">
        <h1 className="text-4xl font-bold text-center text-pink-400 mb-6 border-b-2 border-pink-400 pb-2">
          Privacy Policy
        </h1>

        <p className="text-gray-300 text-center mb-8 italic">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-6 text-left">
          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              1. Introduction
            </h2>
            <p>
              Welcome to the <span className="text-pink-400 font-semibold">Hartford Pride Center</span>.  
              Your privacy is important to us. This policy explains how we collect, use, and protect
              your personal information when you visit our website or participate in our programs.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              2. Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Personal details such as your name, email, or phone number (if you provide them).</li>
              <li>Messages or forms submitted through our <Link to="/contact" className="text-pink-400 underline hover:text-yellow-300">Contact</Link> page.</li>
              <li>Anonymous website analytics to understand how visitors use our site.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              3. How We Use Your Information
            </h2>
            <p>
              We use your information solely to improve our services and maintain communication.
              This may include responding to inquiries, sending event updates, or sharing community resources.
              We never sell or trade your data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              4. Data Protection & Security
            </h2>
            <p>
              We take reasonable measures to protect your data from unauthorized access, alteration,
              or disclosure. Only authorized staff and trusted partners may access your information,
              and solely for official purposes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              5. Your Rights
            </h2>
            <p>
              You have the right to request access, correction, or deletion of your data at any time.
              Please contact us at{" "}
              <a
                href="mailto:info@hartfordpridecenter.org"
                className="text-pink-400 underline hover:text-yellow-300"
              >
                info@hartfordpridecenter.org
              </a>{" "}
              for any privacy-related inquiries.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              6. External Links
            </h2>
            <p>
              Our website may contain links to external organizations or community partners.  
              We are not responsible for the privacy policies or content of external sites.
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              7. Policy Updates
            </h2>
            <p>
              We may update this policy periodically to reflect changes in our practices or services.  
              Please revisit this page occasionally to stay informed.
            </p>
          </div>
        </section>

        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 border border-white/20"
          >
            ⬅ Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
