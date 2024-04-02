import React from 'react'
import Card from './Card'
import { useEffect, useState } from "react"
import axios from 'axios'
import { useParams } from 'react-router-dom'
const Team = () => {
    const [team, setTeam] = useState([])
    const teamId=useParams().id;
    useEffect(() => {
        axios.get('team/'+teamId)
        .then((res) => {
            setTeam(res.data.members)
        })
        .catch((err) => {
            console.log(err)
        })
    }, []);
    
  return (<>
  <h1 className='p-4 text-heading text-center text-3xl'>Team</h1>
  <h4 className='p-4 text-heading text-center text-l'>Team Id: {teamId}</h4>
  <h3 className='p-4 text-heading text-center text-2xl'>Team Members</h3>
    {team.map((member) => (
        <Card key={member.id} user={member}  />
    ))}
  </>
  )
}

export default Team