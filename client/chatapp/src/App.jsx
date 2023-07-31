import { BrowserRouter } from "react-router-dom";
import Router from "./components/router/router";
import TopNavbar from "./components/common/top-navbar";

function App() {
  return (
    <BrowserRouter>
      <TopNavbar />
      <Router />
    </BrowserRouter>
  );
}

export default App;


// import { useState } from 'react'
// import './App.css'
// import { useQuery } from '@tanstack/react-query';
// import fetchAPI from './api/fetch_api';

// function App() {

//   const usersQuery = useQuery({
//     queryKey: ['users'],
//     staleTime: 1000 * 60 * 5, // 5 minutes
//     queryFn: () => fetchAPI('users')
//   })

//   if (usersQuery.isLoading) return <p>Loading...</p>
//   if (usersQuery.isError) return <pre>Error: {usersQuery.error.message}</pre>

//   return (
//     <div>
//       {usersQuery.data.map((user) => (
//         <div key={user.id}>{user.name}</div>
//       ))}
//     </div>
//   )
// }

// export default App
