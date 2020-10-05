exports.run = (client, message, args) => {
    require('./follow.js').run(client, message, args);
}
