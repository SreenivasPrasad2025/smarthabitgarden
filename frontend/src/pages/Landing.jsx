import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const features = [
    {
      icon: "🌱",
      title: "Grow Your Habits",
      description: "Watch your habits grow like plants. Each completed task nurtures your digital garden.",
    },
    {
      icon: "📊",
      title: "Track Your Progress",
      description: "Beautiful visualizations with heatmaps, growth paths, and insightful analytics.",
    },
    {
      icon: "🎯",
      title: "Stay Motivated",
      description: "Set goals, track streaks, and celebrate milestones as you build better habits.",
    },
    {
      icon: "🧠",
      title: "Smart Insights",
      description: "Get personalized insights about your habits and performance over time.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-3xl">🌱</span>
              <span className="text-xl font-bold text-green-700">Smart Habit Garden</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4"
            >
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-green-700 hover:text-green-800 px-4 py-2 rounded-lg hover:bg-green-100 transition font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16"
      >
        <div className="text-center">
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block text-8xl mb-6 animate-bounce">🌿</span>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6"
          >
            Grow Your Habits,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              One Day at a Time
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Transform your daily routines into a thriving garden. Track habits, visualize progress,
            and watch your personal growth bloom.
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Growing Today
            </Link>
            <Link
              to="/login"
              className="bg-white text-green-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition font-bold text-lg shadow-lg border-2 border-green-600"
            >
              Sign In
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-green-200">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 text-center text-white font-semibold">Dashboard Preview</div>
            </div>
            <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">🌱 My Habit Garden</h2>
                    <p className="text-gray-600">Your personal growth dashboard</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Welcome,</p>
                    <p className="font-bold text-gray-800">Zack</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                    🌱 Habit Insights
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-gray-800">3</div>
                      <div className="text-sm text-gray-600">Total Habits</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-gray-800">4</div>
                      <div className="text-sm text-gray-600">Total Days Logged</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-gray-800">2.33</div>
                      <div className="text-sm text-gray-600">Avg Streak</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 text-center border-2 border-yellow-200">
                      <div className="text-2xl mb-1">🏆</div>
                      <div className="text-xs font-semibold text-gray-700">Coding</div>
                      <div className="text-xs text-gray-600">Best: 3 days</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                    🌻 Growth Path — How Your Plant Evolves
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-4xl mb-2">🌱</div>
                      <div className="font-bold text-gray-800">Seedling</div>
                      <div className="text-sm text-gray-600">Days 0-2</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-4xl mb-2">🌿</div>
                      <div className="font-bold text-gray-800">Sprout</div>
                      <div className="text-sm text-gray-600">Days 3-6</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-4xl mb-2">🌴</div>
                      <div className="font-bold text-gray-800">Tree</div>
                      <div className="text-sm text-gray-600">Days 7-13</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-4xl mb-2">🌸</div>
                      <div className="font-bold text-gray-800">Blossom</div>
                      <div className="text-sm text-gray-600">Day 14+</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                    📅 Your Habit Journey
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Activity from January to December - each square represents a day</p>
                  <div className="bg-white rounded-lg p-4 overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                      {[...Array(12)].map((_, month) => (
                        <div key={month} className="flex flex-col gap-1">
                          {[...Array(5)].map((_, day) => (
                            <div
                              key={day}
                              className={`w-3 h-3 rounded-sm ${
                                month === 9 && day >= 2 ? 'bg-green-400' : 'bg-gray-200'
                              }`}
                            ></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-green-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-800 text-lg">Coding</h3>
                      <button className="text-red-500 text-sm">Delete</button>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Streak: <span className="font-bold">3 day(s)</span></p>
                    <p className="text-sm text-gray-600 mb-4">Last grown: 15/10/2025</p>
                    <button className="w-full bg-gray-400 text-white py-2 rounded-lg mb-4">
                      Done for Today ✅
                    </button>
                    <div className="flex justify-center">
                      <div className="text-6xl">🌿</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-green-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-800 text-lg">Gym</h3>
                      <button className="text-red-500 text-sm">Delete</button>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '40%'}}></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Streak: <span className="font-bold">2 day(s)</span></p>
                    <p className="text-sm text-gray-600 mb-4">Last grown: 15/10/2025</p>
                    <button className="w-full bg-gray-400 text-white py-2 rounded-lg mb-4">
                      Done for Today ✅
                    </button>
                    <div className="flex justify-center">
                      <div className="text-6xl">🌱</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-green-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-800 text-lg">Yoga</h3>
                      <button className="text-red-500 text-sm">Delete</button>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '40%'}}></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Streak: <span className="font-bold">2 day(s)</span></p>
                    <p className="text-sm text-gray-600 mb-4">Last grown: 15/10/2025</p>
                    <button className="w-full bg-gray-400 text-white py-2 rounded-lg mb-4">
                      Done for Today ✅
                    </button>
                    <div className="flex justify-center">
                      <div className="text-6xl">🌱</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you build lasting habits and track your journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition cursor-pointer"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start your journey to better habits in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Garden",
                description: "Sign up and add your first habits. Each habit becomes a plant in your garden.",
                icon: "🌱",
              },
              {
                step: "2",
                title: "Complete Daily Tasks",
                description: "Check off habits as you complete them. Watch your plants grow with each completion.",
                icon: "✅",
              },
              {
                step: "3",
                title: "Watch Your Growth",
                description: "Track progress with beautiful visualizations and celebrate your achievements.",
                icon: "🌳",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">
                  {item.step}
                </div>
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center px-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Growth Journey?
          </h2>
          <p className="text-xl text-green-100 mb-10">
            Join thousands of users who are building better habits and transforming their lives
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-green-700 px-10 py-4 rounded-xl hover:bg-gray-100 transition font-bold text-xl shadow-2xl transform hover:scale-105"
          >
            Get Started for Free
          </Link>
        </motion.div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl">🌱</span>
              <span className="text-xl font-bold">Smart Habit Garden</span>
            </div>
            <p className="text-gray-400 mb-6">
              Grow your habits, one day at a time.
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 Smart Habit Garden. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
