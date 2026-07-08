// This shim resolves the deprecation warning for node-domexception 
// by using the native DOMException available in Node.js 18+.

if (typeof globalThis.DOMException !== 'undefined') {
  module.exports = globalThis.DOMException;
} else if (typeof global.DOMException !== 'undefined') {
  module.exports = global.DOMException;
} else {
  // Fallback for very old environments, though unlikely in this setup
  module.exports = class DOMException extends Error {
    constructor(message, name) {
      super(message);
      this.name = name;
    }
  };
}
