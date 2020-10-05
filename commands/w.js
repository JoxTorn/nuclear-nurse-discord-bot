exports.run = (client, message, args) => {
    require('./wallet.js').run(client, message, args);
}
