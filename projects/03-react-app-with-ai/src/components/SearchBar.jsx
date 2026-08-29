import { useEffect, useState } from 'react'

export default function SearchBar({ query, onSearch }) {
  const [term, setTerm] = useState(query)

  useEffect(() => {
    setTerm(query)
  }, [query])

  function handleSubmit(event) {
    event.preventDefault()
    onSearch(term.trim())
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="search-input">
        Search movies
      </label>
      <input
        id="search-input"
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search by title"
      />
      <button type="submit">Search</button>
    </form>
  )
}
