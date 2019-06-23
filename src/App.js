import React, { useState, useEffect } from 'react'

function App() {
  /* Setar variaveis de estado */
  const [repositories, setRepositories] = useState([])
  const [location, setLocations] = useState({})

  /* Component Did Mount */
  useEffect(() => {
    fetchData()

    const watch = navigator.geolocation.watchPosition(handlePostionReceived)

    /* Component Will Unmount */
    return () => navigator.geolocation.clearWatch(watch)
  }, [])

  /* Do async to fetch outside de useEffect */
  async function fetchData() {
    const response = await fetch(
      'https://api.github.com/users/erisjunior/repos'
    )

    const data = await response.json()

    setRepositories(data)
  }

  function handlePostionReceived({ coords }) {
    const { latitude, longitude } = coords

    setLocations({ latitude, longitude })
  }

  /* Component Did Update whith repositories */
  useEffect(() => {
    const filtered = repositories.filter(repo => repo.favorite)

    document.title = `Você tem ${filtered.length} favs`
  }, [repositories])

  function handleAddRepository() {
    setRepositories([...repositories, { id: Math.random(), name: 'Add' }])
  }

  function handleFavorite(id) {
    const newRepositories = repositories.map(repo => {
      return repo.id === id ? { ...repo, favorite: !repo.favorite } : repo
    })

    setRepositories(newRepositories)
  }

  return (
    <>
      <ul>
        {repositories.map(repo => (
          <li key={repo.id}>
            {repo.name} {repo.favorite && '(Fav)'}
            <button onClick={() => handleFavorite(repo.id)}>Favoritar</button>
          </li>
        ))}
      </ul>
      <button onClick={() => handleAddRepository}>ADD</button>
      <p>
        Lat: {location.latitude} <br />
        Long: {location.longitude}
      </p>
    </>
  )
}

export default App
