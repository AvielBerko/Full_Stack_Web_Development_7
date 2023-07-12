import { useState } from 'react'
import './App.css'
import { useQuery } from '@tanstack/react-query';
import fetchAPI from './api/fetch_api';

function App() {

  const usersQuery = useQuery({
    queryKey: ['users'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: () => fetchAPI('users')
  })

  if (usersQuery.isLoading) return <p>Loading...</p>
  if (usersQuery.isError){
    return <pre>{(usersQuery.error.message)}</pre>
  } 

  return (
    <div>
      {usersQuery.data.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}

export default App
