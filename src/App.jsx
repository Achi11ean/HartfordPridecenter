import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Homepage";
import About from "./About";
import NavBar from "./NavBar";
import Services from "./Services";
import OurTeam from "./OurTeam";
import ContactPageTemplate from "./Contact";
import Privacy from "./Privacy";
import Volunteer from "./Volunteer";
import Donate from "./Donate";
import Events from "./Events";
import HartfordCityPride from "./CapitalCityPride";
import AdminSubmissionsPage from "./AdminSubmissionsPage";

function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
        {/* Root route */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/ourteam" element={<OurTeam />} />
        <Route path="/contact" element={<ContactPageTemplate />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/events" element={<Events />} />
        <Route path="/admin-submissions" element={<AdminSubmissionsPage />} />
        <Route path="/hartford-city-pride" element={<HartfordCityPride />} />
                <Route path="/donate" element={<Donate />} />

      </Routes>
    </Router>
  );
}

export default App;
