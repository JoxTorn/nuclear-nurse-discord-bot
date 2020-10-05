exports.run = (client, message, args) => {
    require('./verify.js').run(client, message, args);
}
