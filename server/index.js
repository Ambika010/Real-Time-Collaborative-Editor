const express = require("express")
const app = express()
const http = require("http")
const { Server } = require("socket.io")

const server = http.createServer(app)

const io = new Server(server)
const userSocketMap = {}

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            }
        }
    )
}

io.on("connection", (socket) => {
    // console.log(`User Connected: ${socket.id}`);

    socket.on("join", ({roomId, username}) =>{
        userSocketMap[socket.id] = username
        socket.join(roomId)
        const clients = getAllConnectedClients(roomId)
        // notify to all users that a new user has joined or entered the room
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit('joined', {
              clients,
              username,
              socketId: socket.id,
            })
        })
    })

    // sync the code
    socket.on('code-change', ({ roomId, code }) => {
        socket.in(roomId).emit('code-change', { code })
    })

    // when a new user joins the room all the code which are there are also shown on that persons editor
    socket.on('sync-code', ({ socketId, code }) => {
        io.to(socketId).emit('code-change', { code });
    })

    // leave room
    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms]
        // leave all the room
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            })
        })
        delete userSocketMap[socket.id]
        socket.leave();
    })
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is Running..."));