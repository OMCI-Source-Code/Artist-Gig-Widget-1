import React from 'react';


export default function Protected({ children }){
const token = localStorage.getItem('token');
if (!token) return <p>Please log in to access the dashboard.</p>;
return children;
}