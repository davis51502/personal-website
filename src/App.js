import React from 'react';
import './App.css';
import Header from './components/Header';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import projects, { socials } from './data/projects';

function App() {
  const name = 'Davis Wollesen';
  const title = 'Software Engineer/Investment Analyst';
  const bio = "I'm a Computer Science major involved in investment analytics.";
  const skills = ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js'];

  const [activeSection, setActiveSection] = React.useState('about');

  const handleNavigate = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="App">
      <Header name={name} title={title} socials={socials} activeSection={activeSection} onNavigate={handleNavigate} />
      <main>
        {activeSection === 'about' && <About bio={bio} skills={skills} />}
        {activeSection === 'projects' && <Projects projects={projects} />}
        {activeSection === 'contact' && <Contact email="daviswollesen@gmail.com" />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
