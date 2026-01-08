import React from "react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
<div className="
  min-h-screen 
  bg-gradient-to-br 
  from-black via-[#0F2D25] to-[#18453B] 
  text-white 
  py-10 px-4
">
  <div className="
    max-w-4xl 
    mt-4 sm:mt-28 
    mx-auto 
    bg-black/40 
    border-2 border-[#18453B] 
    rounded-2xl 
    shadow-2xl 
    p-6 sm:p-10 
    backdrop-blur-md
  ">

        <h1 className="text-4xl font-bold text-center text-yellow-300 mb-6 border-b-4 border-yellow-300 pb-2">
          Privacy Policy
        </h1>

        <p className="text-yellow-200 text-center mb-8 italic">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-6 text-left">

          {/* 1 */}
          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              1. Introduction
            </h2>
            <p className="text-yellow-100 leading-relaxed">
              Welcome to the{" "}
              <span className="text-yellow-300 font-semibold">
                Hartford Pride Center
              </span>.
              Your privacy is important to us. This policy explains how we collect,
              use, and protect your personal information when you visit our website
              or participate in our programs.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              2. Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-1 text-yellow-100 leading-relaxed">
              <li>Personal details such as your name, email, or phone number (if you provide them).</li>
              <li>
                Messages or forms submitted through our{" "}
                <Link
                  to="/contact"
                  className="text-yellow-300 underline hover:text-white"
                >
                  Contact
                </Link>{" "}
                page.
              </li>
              <li>Anonymous website analytics to understand how visitors use our site.</li>
            </ul>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              3. How We Use Your Information
            </h2>
            <p className="text-yellow-100 leading-relaxed">
              We use your information solely to improve our services and maintain
              communication. This may include responding to inquiries, sending event
              updates, or sharing community resources. We never sell or trade your
              data.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              4. Data Protection & Security
            </h2>
            <p className="text-yellow-100 leading-relaxed">
              We take reasonable measures to protect your data from unauthorized
              access, alteration, or disclosure. Only authorized staff and trusted
              partners may access your information, and solely for official purposes.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              5. Your Rights
            </h2>
            <p className="text-yellow-100 leading-relaxed">
              You have the right to request access, correction, or deletion of your
              data at any time. Please contact us at{" "}
              <a
                href="mailto:david@hartfordpridecenter.org"
                className="text-yellow-300 underline hover:text-white"
              >
                david@hartfordpridecenter.org
              </a>{" "}
              for any privacy-related inquiries.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              6. External Links
            </h2>
            <p className="text-yellow-100 leading-relaxed">
              Our website may contain links to external organizations or community
              partners. We are not responsible for the privacy policies or content
              of external sites.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-2xl text-yellow-300 font-semibold mb-2">
              7. Policy Updates
            </h2>
            <p className="text-yellow-100 leading-relaxed">
              We may update this policy periodically to reflect changes in our
              practices or services. Please revisit this page occasionally to stay
              informed.
            </p>
          </div>

        </section>

        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 text-black font-semibold rounded-full hover:scale-105 transition-transform duration-300 border border-yellow-300 shadow-lg"
          >
            ⬅ Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
