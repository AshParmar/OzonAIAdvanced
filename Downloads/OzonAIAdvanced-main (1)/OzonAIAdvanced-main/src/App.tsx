import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Menu,
  X,
  Bot,
  Github,
  Linkedin,
  Twitter,
  LogIn,
  UserPlus,
  Home,
  Info,
  Sparkles,
  BookOpen,
  Star,
  Newspaper,
  ArrowRight, 
  Users,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion"; // Import motion from framer-motion
import CoursesPage from "./components/CoursesPage"; // Ensure this path is correct
import NewsSection from "./components/NewsSection"; // Import the NewsSection component
import ScrollToTop from "./ScrollToTop"; // Import the ScrollToTop component

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAuth, setShowAuth] = useState(false); // Add showAuth state
  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <Router>
      <ScrollToTop /> {/* Add ScrollToTop component */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1a1a2e] to-[#1a1a2e] text-gray-100 overflow-auto">
        {/* Navbar */}
        <nav className="fixed w-full bg-[#1a1a2e]/80 backdrop-blur-lg z-50 border-b border-indigo-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  OZON
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-8">
                  <Link to="/" className="flex items-center space-x-2 hover:text-indigo-400 transition-colors">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </Link>
                  <Link to="#" className="flex items-center space-x-2 hover:text-indigo-400 transition-colors">
                    <Info className="w-4 h-4" />
                    <span>About</span>
                  </Link>
                  
                  <Link to="/courses" className="hover:text-indigo-400 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" /> Resume Builder
                  </Link>
                  {/* AI News Link */}
                  <Link to="/ai-news" className="hover:text-indigo-400 flex items-center">
                    <Newspaper className="w-4 h-4 mr-2" /> AI News
                  </Link>
                  <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 text-blue-100/80 hover:text-white transition-colors"
                onClick={() => setShowAuth(true)}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Sign Up
              </motion.button>
                </div>
              </div>
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes for Pages */}
        <Routes>
  <Route
    path="/"
    element={
      <>
        <section className="pt-40 pb-20 px-4 max-w-7xl mx-auto">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Transform Your Career with AI-Driven Skills
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover personalized learning paths and advance your career with intelligent skill recommendations powered by cutting-edge AI technology.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/courses">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
              >
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              </Link>
              <button className="px-8 py-4 rounded-full bg-transparent border border-indigo-500 hover:bg-indigo-500/20 transition-all hover:scale-105 flex items-center justify-center">
                <Bot className="w-5 h-5 mr-2" /> Chat with Ozon
              </button>
            </div>
          </div>
        </section>
        <HomePageSections />
      </>
    }
  />
  <Route path="/courses" element={<CoursesPage />} /> {/* Explore Courses Route */}
  <Route path="/ai-news" element={<NewsSection />} /> {/* AI News Route */}
</Routes>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

// HomePageSections Component
const HomePageSections = () => {
  useEffect(() => {
    // Reset visibility state when the component mounts
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Why Choose Us */}
      <section className="pt-40 py-24 px-4 bg-[#1a1a2e]/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Driven Recommendations",
                description:
                  "Get personalized course suggestions based on your skills and goals",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
                icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
              },
              {
                title: "Resume Builder",
                description:
                  "Create professional resumes that highlight your achievements",
                image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4",
                icon: <BookOpen className="w-6 h-6 text-indigo-400" />,
              },
              {
                title: "Skill Analysis",
                description:
                  "Identify gaps in your skillset and get targeted recommendations",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
                icon: <Users className="w-6 h-6 text-indigo-400" />,
              },
            ].map((card, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-[#1a1a2e]/80 p-8 hover:bg-indigo-900/30 transition-all duration-300 hover:scale-105 border border-indigo-500/20 animate-on-scroll opacity-0"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  {card.icon}
                  <img
                    src={`${card.image}?auto=format&fit=crop&w=800&q=80`}
                    alt={card.title}
                    className="w-full h-48 object-cover rounded-lg my-6"
                  />
                  <h3 className="text-2xl font-bold mb-4 text-white">{card.title}</h3>
                  <p className="text-gray-300">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Reviews */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Developer",
                review:
                  "OZON helped me identify and fill crucial skill gaps in my development journey. The AI recommendations were spot-on!",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
              },
              {
                name: "Michael Chen",
                role: "Data Scientist",
                review:
                  "The personalized learning path made all the difference in my career transition. Highly recommended!",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
              },
              {
                name: "Emily Rodriguez",
                role: "UX Designer",
                review:
                  "The platform's AI-driven approach to skill development is revolutionary. It's like having a personal career coach.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
              },
            ].map((review, index) => (
              <div
                key={index}
                className="group bg-[#1a1a2e]/80 p-8 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 animate-on-scroll opacity-0"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={`${review.avatar}?auto=format&fit=crop&w=100&h=100&q=80`}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{review.name}</h4>
                    <p className="text-gray-400 text-sm">{review.role}</p>
                  </div>
                </div>
                <p className="text-gray-300">{review.review}</p>
                <div className="flex mt-4 text-indigo-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-[#1a1a2e]/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            How It Works
          </h2>
          <div className="aspect-w-16 aspect-h-9 mb-16 animate-on-scroll opacity-0">
            <iframe
              className="w-full h-[500px] rounded-2xl"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Platform Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Get in Touch
          </h2>
          <form className="space-y-6 animate-on-scroll opacity-0">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a2e]/80 border border-indigo-500/20 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-400"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a2e]/80 border border-indigo-500/20 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-400"
              />
            </div>
            <textarea
              placeholder="Message"
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a2e]/80 border border-indigo-500/20 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-400"
            />
            <button className="w-full px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-105 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-[#1a1a2e] border-t border-indigo-500/20 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">OZON</h3>
            <p className="text-gray-300">
              Empowering professionals through AI-driven skill development.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-indigo-400">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-indigo-500/20 text-center text-gray-300">
          <p>&copy; 2025 OZON. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default App;