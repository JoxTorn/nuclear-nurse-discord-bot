exports.run = (client, message, args) => {
    require('./listmembers.js').run(client, message, args);
}
