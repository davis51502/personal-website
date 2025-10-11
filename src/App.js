import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Blog from './components/Blog/Blog';
import BlogPost from './components/BlogPost/BlogPost';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import projects, { socials } from './data/projects';

function MainContent() {
  const name = 'Davis Wollesen';
  const title = 'Software Engineer/Investment Analyst';
  
  const bio = "I'm a Computer Science major specializing in applying technical expertise to financial markets and investment strategies. With a strong foundation in software development and data analysis, I'm passionate about building data-driven solutions that uncover investment insights and optimize portfolio performance. My goal is to bridge the gap between cutting-edge technology and quantitative finance.";
  
  const skills = [
    'Python',
    'JavaScript', 
    'React',
    'Node.js',
    'SQL & PostgreSQL',
    'Data Analysis & Visualization',
    'Financial Modeling',
    'Statistical Analysis',
    'Machine Learning',
    'Pandas & NumPy',
    'API Integration',
    'Git & Docker',
    'Quantitative Research',
    'Portfolio Optimization',
    'Risk Assessment'
  ];

  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active section from URL path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/') return 'about';
    if (path.startsWith('/blog')) return 'blog';
    if (path === '/projects') return 'projects';
    if (path === '/contact') return 'contact';
    return 'about';
  };

  const handleNavigate = (id) => {
    navigate(`/${id === 'about' ? '' : id}`);
  };

  const activeSection = getActiveSection();

  return (
    <div className="App">
      <Header name={name} title={title} socials={socials} activeSection={activeSection} onNavigate={handleNavigate} />
      
      <Routes>
        {/* Blog routes WITHOUT sidebar */}
        <Route path="/blog" element={
          <main className="content-full">
            <Blog />
          </main>
        } />
        <Route path="/blog/:id" element={<BlogPost />} />
        
        {/* Contact route WITHOUT sidebar */}
        <Route path="/contact" element={
          <main className="content-full">
            <Contact email="daviswollesen@gmail.com" />
          </main>
        } />
        
        {/* Other routes WITH sidebar */}
        <Route path="*" element={
          <div className="layout container">
            <Sidebar
              name={name}
              location="Danville, CA"
              email="daviswollesen@gmail.com"
              socials={socials}
              photo="/IMG_0922.jpeg"
            />
            <main className="content">
              <Routes>
                <Route path="/" element={<About bio={bio} skills={skills} />} />
                <Route path="/projects" element={<Projects projects={projects} />} />
              </Routes>
            </main>
          </div>
        } />
      </Routes>
      
      <Footer />
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