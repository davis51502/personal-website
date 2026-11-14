import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Blog from './components/Blog/Blog';
import Contact from './components/Contact/Contact';
import Hobbies from './components/Hobbies/Hobbies';
import AI from './components/AI/AI';
import Race from './components/Race/Race';
import Footer from './components/Footer/Footer';
import projects, { socials } from './data/projects';
import experience, { education, certifications } from './data/experience';
import hobbies from './data/hobbies';
import { approach, caseStudies, sqlDemo, aiArticle } from './data/ai';

function MainContent() {
  const name = 'Davis Wollesen';
  const title = 'Software Engineer · Investment Analyst';
  
  const bio = "I'm a software engineer with a B.S. in Computer Science from BYU, focused on applying technical skills to financial markets and investment strategy. In New York I automate operations at City Skyline Realty Group with data pipelines and AI. Before that I built AWS pipelines over terabytes of healthcare data. On the side I run the AI Portfolio Race, a live experiment where Claude, ChatGPT, and Gemini manage simulated portfolios against the S&P 500. I'm most interested in data-driven work that bridges engineering and quantitative finance.";

  const skillGroups = [
    {
      label: 'Languages & tools',
      items: ['Python (Pandas, NumPy, scikit-learn, XGBoost)', 'SQL (PostgreSQL, MySQL)', 'JavaScript & React', 'AWS', 'Docker', 'Git', 'Excel', 'PowerPoint'],
    },
    {
      label: 'Markets & analysis',
      items: ['Predictive Modeling', 'Options Pricing (Black-Scholes)', 'Portfolio Backtesting', 'Financial Modeling', 'Statistical Analysis', 'Machine Learning', 'Risk Assessment'],
    },
  ];

  const location = useLocation();
  
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/') return 'about';
    if (path.startsWith('/blog')) return 'blog';
    if (path === '/projects') return 'projects';
    if (path === '/ai') return 'ai';
    if (path === '/race') return 'race';
    if (path === '/hobbies') return 'hobbies';
    if (path === '/contact') return 'contact';
    return 'about';
  };

  const activeSection = getActiveSection();

  // Start each page at the top instead of keeping the previous page's scroll.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="App">
      <Header name={name} title={title} activeSection={activeSection} />
      
      <Routes>
        <Route path="/projects" element={
          <main className="content-full">
            <Projects projects={projects} />
          </main>
        } />

        <Route path="/ai" element={
          <main className="content-full">
            <AI approach={approach} caseStudies={caseStudies} sqlDemo={sqlDemo} article={aiArticle} />
          </main>
        } />

        <Route path="/race" element={
          <main className="content-full">
            <Race />
          </main>
        } />

        <Route path="/blog" element={
          <main className="content-full">
            <Blog />
          </main>
        } />

        <Route path="/hobbies" element={
          <main className="content-full">
            <Hobbies hobbies={hobbies} />
          </main>
        } />

        <Route path="/contact" element={
          <main className="content-full">
            <Contact email="daviswollesen@gmail.com" socials={socials} />
          </main>
        } />
        
        <Route path="/" element={
          <main className="content-full">
            <About
              name={name}
              tagline={title}
              location="New York, NY"
              email="daviswollesen@gmail.com"
              socials={socials}
              photo="/IMG_0922.jpeg"
              bio={bio}
              skillGroups={skillGroups}
              experience={experience}
              education={education}
              certifications={certifications}
            />
          </main>
        } />
      </Routes>
      
      <Footer socials={socials} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;
