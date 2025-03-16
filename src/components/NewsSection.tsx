import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSearch, FaRobot, FaCode, FaChartLine, FaShieldAlt, FaBitcoin } from "react-icons/fa";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY || "c809b837a28a4a35a72f85ba1017676e";
const BASE_URL = "https://newsapi.org/v2/everything";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
}

const NewsSection: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("Artificial Intelligence");

  const categories = [
    { name: "Artificial Intelligence", icon: <FaRobot />, query: "artificial intelligence OR AI OR machine learning" },
    { name: "Web Development", icon: <FaCode />, query: "web development OR frontend OR backend OR JavaScript" },
    { name: "Data Science", icon: <FaChartLine />, query: "data science OR big data OR data analytics" },
    { name: "Cybersecurity", icon: <FaShieldAlt />, query: "cybersecurity OR ethical hacking OR network security" },
    { name: "Blockchain", icon: <FaBitcoin />, query: "blockchain OR cryptocurrency OR web3 OR smart contracts" },
  ];
  useEffect(() => {
    console.log("API_KEY:", API_KEY); // Add this line to check if the API key is being read correctly
    fetchNews(category);
  }, [category]);

  const fetchNews = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: query,
          sortBy: "publishedAt",
          language: "en",
          apiKey: API_KEY,
        },
      });
      setArticles(response.data.articles);
    } catch (err) {
      setError("Failed to load news. Check API key or network.");
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      fetchNews(searchQuery);
    }
  };

  return (
    <div className="bg-[#010C1D] text-white min-h-screen p-8 flex flex-col items-center">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 text-4xl font-bold text-center bg-gradient-to-r from-sky-400 to-blue-600 text-transparent bg-clip-text"
      >
        Latest Tech News
      </motion.h2>

      {/* Category Filters */}
      <div className="flex gap-4 mt-6 flex-wrap justify-center">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => {
              setCategory(cat.query);
              fetchNews(cat.query);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              category === cat.query
                ? "bg-blue-500 shadow-lg shadow-blue-500/50 scale-105"
                : "bg-gray-800 hover:bg-blue-400"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center mt-6 w-full max-w-lg bg-gray-900 rounded-full px-4 py-3 shadow-lg border border-blue-500"
      >
        <input
          type="text"
          placeholder="Search specific topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 bg-transparent text-white focus:outline-none placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-sky-500 hover:bg-sky-600 transition p-3 rounded-full ml-2"
        >
          <FaSearch className="text-white" />
        </button>
      </motion.form>

      {/* Loading & Error Handling */}
      {loading && <p className="text-center text-gray-400 mt-6">Loading news...</p>}
      {error && <p className="text-center text-red-400 mt-6">{error}</p>}

      {/* News Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full max-w-6xl">
        {articles.map((article, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-900 bg-opacity-80 p-5 rounded-2xl shadow-lg hover:scale-105 transition transform duration-300 backdrop-blur-md border border-blue-500"
          >
            <img
              src={article.urlToImage || "https://via.placeholder.com/300"}
              alt={article.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-blue-400">{article.title}</h3>
            <p className="text-gray-400 mt-2">{article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-blue-400 hover:underline"
            >
              Read More →
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;