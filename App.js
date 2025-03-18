
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { debounce } from './utils/debounce';
import './App.css';

// Lazy loaded components for performance optimization
const Hero = lazy(() => import('./components/Hero'));
const Services = lazy(() => import('./components/Services'));
const Pricing = lazy(() => import('./components/Pricing'));
const Contact = lazy(() => import('./components/Contact'));
const UserSection = lazy(() => import('./components/UserSection'));

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Debounced search function
  const handleSearch = debounce((term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredUsers(users);
      return;
    }

    // Filter users based on search term (case insensitive)
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, 300);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">Company Logo</div>
        <nav className="nav">
          <a href="#hero">Home</a>
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#users">Users</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <section id="hero">
          <Hero />
        </section>

        <section id="services">
          <Services />
        </section>

        <section id="pricing">
          <Pricing />
        </section>

        <section id="users">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users..."
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <UserSection users={filteredUsers} isLoading={isLoading} />
        </section>

        <section id="contact">
          <Contact />
        </section>
      </Suspense>

      <footer className="footer">
        <p>&copy; 2025 Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;