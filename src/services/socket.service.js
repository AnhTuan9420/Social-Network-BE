const connection = (socket) => {
  // eslint-disable-next-line no-console
  console.log(`User connection id is ${socket.id}`);
  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log(`User disconnect id is ${socket.id}`);
  });

  // event on here
  socket.on('message', (msg) => {
    // eslint-disable-next-line no-console
    console.log(msg);
    // _io.emit('chat message', msg);
  });

  // on room..
};

module.exports = {
  connection,
};
