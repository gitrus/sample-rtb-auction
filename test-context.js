var context = require.context('./src/__tests__', true, /\.js$/);
context.keys().forEach(context);
console.log(context.keys());