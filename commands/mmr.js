exports.run = (client, message, args) => {
    require('./matrixmemberrole.js').run(client, message, args);
}
