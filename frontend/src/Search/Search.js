import React, { useState } from 'react';
import SearchIcon from '../assets/magnifying-glass-solid.svg';

const Search = () => {
  const [query, setQuery] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Search query: ${query}`);
    setQuery('');
  }

  return (
    <div>
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
          <img src={SearchIcon} alt="Search Icon" className='search' />
        </button>
      </form>
    </div>
  )
}

export default Search
