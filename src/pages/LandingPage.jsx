import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tight">YourApp</div>
        <Link to="/login" className="text-sm font-medium hover:text-gray-700 transition-colors">
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 flex-grow flex items-center justify-center text-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Simplify Your Workflow
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Streamline your team's processes with intelligent tools designed to boost productivity and collaboration.
          </p>
            <Link 
              to="/register" 
              className="primary-color p-10"
            >
              Get Started
            </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { 
              title: "Efficiency", 
              description: "Automate repetitive tasks and reclaim your time.",
            },
            { 
              title: "Collaboration", 
              description: "Break down silos and enhance team communication.",
            },
            { 
              title: "Insights", 
              description: "Make data-driven decisions with real-time analytics.",
            }
          ].map((feature, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center">
        <p className="text-sm text-gray-500">
          © 2024 YourApp. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;