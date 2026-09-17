import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-secondary text-slate-300 mt-16">
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-white font-bold text-lg mb-3">WorkerConnect</h3>
        <p className="text-sm text-slate-400">Connecting local skilled workers with the customers who need them, faster.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">For Customers</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/search" className="hover:text-white">Find Workers</Link></li>
          <li><Link to="/how-it-works" className="hover:text-white">How It Works</Link></li>
          <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">For Workers</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/register/worker" className="hover:text-white">Create Profile</Link></li>
          <li><Link to="/login" className="hover:text-white">Worker Login</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-3">Follow Us</h4>
        <div className="flex gap-4 text-lg">
          <a href="#" aria-label="Facebook" className="hover:text-white"><FaFacebook /></a>
          <a href="#" aria-label="Instagram" className="hover:text-white"><FaInstagram /></a>
          <a href="#" aria-label="Twitter" className="hover:text-white"><FaTwitter /></a>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-700 text-center text-xs text-slate-500 py-4">
      © {new Date().getFullYear()} WorkerConnect. All rights reserved.
    </div>
  </footer>
);

export default Footer;
