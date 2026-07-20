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
 import Events from "./Events";
import HartfordCityPride from "./CapitalCityPride";
import AdminSignup from "./AdminSignup";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import DriscollFund from "./DriscollFund";
import StaffDashboard from "./StaffDashboard";
import Signup from "./Signup";
import OurSponsorYellowTemplate from "./OurSponsors";
import Resources from "./Resources";
import SponsorInvitationPage from "./SponsorInvitationPage";
import PrideServicePage from "./PrideServicePage";
import FundersPage from "./FundersPage";
import SponsorInvitation from "./SponsorInvitation";
import Donations from "./Donations";
import Footer from "./Footer";
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
        <Route path="/donations" element={<Donations/>}/>
        <Route path="/contact" element={<ContactPageTemplate />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/events" element={<Events />} />
        <Route path="/pride" element={<HartfordCityPride />} />
        <Route path="/support" element={<SponsorInvitation/>}/>
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sponsors" element={<OurSponsorYellowTemplate />} />
        <Route path="/driscoll-fund-application" element={<DriscollFund />} />
        <Route path="/resources" element={<Resources />}/>
        <Route path="/sponsorinvitation" element={<SponsorInvitationPage/>}/>
<Route path="/services/:slug" element={<PrideServicePage />} />
<Route path="/funders" element={<FundersPage />} />


      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
