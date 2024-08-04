import React, { useEffect, useRef, useState } from 'react'
import Client from './Client'
import Editor from './Editor'
import { initSocket } from "../Socket";
import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import toast from 'react-hot-toast';

function EditorPage() {
  const [clients, setClient] = useState([])
  const codeRef = useRef(null)

  const socketRef = useRef(null)
  const Location = useLocation()
  const navigate = useNavigate();
  const { roomId } = useParams()

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket()
      socketRef.current.on("connect_error", (err) => handleErrors(err))
      socketRef.current.on("connect_failed", (err) => handleErrors(err))

      const handleErrors = (err) => {
        console.log("Socket Error", err)
        toast.error("Socket connection failed, Try again later")
        navigate("/")
      }

      socketRef.current.emit('join', {
        roomId,
        username: Location.state?.username,
      })

      socketRef.current.on('joined', ({ clients, username, socketId }) => {
        // this insure that new user connected message do not display to that user itself
        if (username !== Location.state?.username) {
          toast.success(`${username} joined the room.`)
        }
        setClient(clients)
        socketRef.current.emit('sync-code', {
          code: codeRef.current,
          socketId,
        })
      })

      // listening for disconnected
      socketRef.current.on('disconnected', ({ socketId, username }) => {
        toast.success(`${username} left the room`)
        setClient((prev) => {
          return prev.filter((client) => client.socketId !== socketId)
        })
      })
    }
    init();

    // cleanup
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off('joined');
      socketRef.current.off('disconnected');
    };
  }, [])

  if (!Location.state) {
    return <Navigate to="/" />
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID is copied`);
    } catch (error) {
      toast.error("Unable to Copy Room Id");
    }
  }

  const leaveRoom = async () => {
    navigate("/");
  }

  return (
    <div className='container-fluid vh-100'>
      <div className='row h-100'>
        <div className='col-md-2 text-light d-flex flex-column h-100' 
        style={{backgroundColor: '#700000', borderRight : '15px solid white'}}>
          <img 
            className='img-fluid mx-auto' 
            src='/images/Home Page Logo.png' 
            alt='CollabChat' 
            style={{filter: 'invert(1)', marginTop: '12px'}}>
          </img>
          <hr style={{marginTop: '-5px'}}/>
          {/* client list container */}
          <div className='d-flex flex-column overflow-auto'>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username}/>
            ))}
          </div>
          {/* buttons */}
          <div className='mt-auto'>
            <hr/>
            <button className='btn btn-success' onClick={copyRoomId}>Copy Room ID</button>
            <button className='btn btn-danger mt-2 mb-3 px-3 btn-block' onClick={leaveRoom}>
              Leave Room
            </button>
          </div>
        </div>
        {/* Editor */}
        <div className='col-md-10 d-flex flex-column h-100' style={{backgroundColor: '#FFB3B3'}}>
          <Editor socketRef = {socketRef} roomId = {roomId} onCodeChange = {(code) => codeRef.current = code}/>
        </div>
      </div>
    </div>
  )
}

export default EditorPage
