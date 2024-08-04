import React from 'react'
import Avatar from 'react-avatar'

function Client({username}) {
  return (
    <div className='d-flex align-items-center mb-3'>
        <Avatar className='mr-3' name={username.toString()} size={50} round="40px"/>
        <span className='mx-2'>{username.toString()}</span>
    </div>
  );
}

export default Client
