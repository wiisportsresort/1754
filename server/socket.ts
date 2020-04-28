import * as socketio from 'socket.io';

export function createSockets(io: socketio.Server) {
  const teachers = io.of('/teacher');
  teachers.on('connection', socket => {
    socket.emit('_identify');
  });

  const students = io.of('/student');
  students.on('connection', socket => {});
  return io;
}
