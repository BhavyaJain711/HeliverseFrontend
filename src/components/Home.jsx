import React from 'react'
import Users from './Users'

const Home = () => {
    return (
        <div className="App pb-8 bg-background min-h-screen p-0 m-0">
            <h1 className='p-8 text-heading text-center text-3xl'>Heliverse Intern Task</h1>
            <Users itemsPerPage={20} />
        </div>
    )
}

export default Home