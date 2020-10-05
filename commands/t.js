exports.run = (client, message, args) => {
    require('./travel.js').run(client, message, args);
}
