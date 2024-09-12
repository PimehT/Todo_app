import React, { useEffect, useState, useRef } from 'react';
import { searchTasks } from '../Utils/taskManagement';
import SearchIcon from '../assets/magnifying-glass-solid.svg';
import './Search.scss';
import { FaSpinner } from 'react-icons/fa';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchResultsRef = useRef(null);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    try {
      const response = await searchTasks(query);
      setResults(response);
      setQuery('');
      setIsSearching(false);
      setIsExpanded(true);
      return response;
    } catch (error) {
      console.error('Error searching tasks:', error.message);
    }
  };

  const handleClickOutside = (event) => {
    if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);
  
  /* useEffect(() => {
    console.log('Search results:', results);
  }, [results]); */

  return (
    <div className='Search'>
      <form role='search' id='form' className='search-bar mini-bar' onSubmit={handleSearch}>
        <input
          type='search'
          id='query'
          name='q'
          placeholder='Search...'
          aria-label='Search through tasks'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className='icon'>
          {isSearching ? (FaSpinner) : (<img src={SearchIcon} alt="Search Icon" className='search' />)}
        </button>
      </form>
      {isExpanded && (<div className='search-results' ref={searchResultsRef}>
        {results.length > 0 ? (
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                <h3>{result.title}</h3>
                <p>{result.description}</p>
                <p>Status: {result.status === 'Complete' ? 'Complete' : 'Pending'}</p>
                <p>Due Date: {result.dueDate}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>)}
    </div>
  )
}

export default Search
