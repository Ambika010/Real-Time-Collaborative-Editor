import React, { useState } from 'react'
import toast from 'react-hot-toast'
import {v4 as uuid} from 'uuid'
import { useNavigate } from "react-router-dom"


function Home() {
    const [roomId, setRoomId] = useState("")
    const [username, setUsername] = useState("")
    const navigate = useNavigate()

    const generateRoomId = (e) => {
        e.preventDefault()
        const Id = uuid()
        setRoomId(Id)
        toast.success("Room Id is generated")
    }

    const joinRoom = () => {
        if (!roomId || !username) {
          toast.error("Both the field is requried")
          return
        }

        // navigate or redirect
        navigate(`/editor/${roomId}`, {
            state: { username },
        })
        toast.success("room is created")
    }

  return (
    <div className='container-fluid'>
        <div className='row justify-content-center align-items-center min-vh-100'>
            <div className='col-12 col-md-6'>
                <div className='card shadow-sm p-2.mb-5 bg-secondary rounded' style={{border : '10px solid black'}}>
                    <div className='card-body text-center bg-light'>
                        <img 
                            className='img-fluid mx-auto d-block' 
                            src='/images/Home Page Logo.png' 
                            alt='CollabChat' 
                            style={{maxWidth : '180px', marginBottom : '40px'}}
                        />
                        <h4>Enter the Room ID</h4>
                        <div className='form-group'>
                            <input 
                                type='text'
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                className='form-control mb-2' 
                                placeholder='ROOM ID'
                                style={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}
                            />
                        </div>
                        <div className='form-group'>
                            <input 
                                type='text'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='form-control mb-2' 
                                placeholder='USERNAME'
                                style={{border: '1px solid rgba(0, 0, 0, 0.2)'}}
                            />
                        </div>
                        <button className='btn btn-success btn-lg btn-block' onClick={joinRoom}>JOIN</button>
                        <p className='mt-3'>
                            Don't have a Room ID?{" "}
                            <span className='text-success p-2' style={{cursor : 'pointer'}} onClick={generateRoomId}>
                                Create New Room
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}


export default Home;
