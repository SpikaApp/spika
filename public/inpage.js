class SpikaWeb3 {
  requestId;

  constructor() {
    this.requestId = 0;
  }

  connect() {
    return this._message("connect", {});
  }

  disconnect() {
    return this._message("disconnect", {});
  }

  isConnected() {
    return this._message("isConnected", {});
  }

  account() {
    return this._message("account", {});
  }

  signMessage(message) {
    return this._message("signMessage", message);
  }

  signAndSubmitTransaction(transaction) {
    return this._message("signAndSubmitTransaction", transaction);
  }

  signTransaction(transaction) {
    return this._message("signTransaction", transaction);
  }

  _message(method, args) {
    const wallet = "spika";
    const id = this.requestId++;
    return new Promise(function (resolve, reject) {
      window.postMessage({ wallet, method, args, id });
      window.addEventListener("message", function handler(event) {
        if (event.data.responseMethod === method && event.data.id === id) {
          const response = event.data.response;
          this.removeEventListener("message", handler);
          if (response === undefined || response === null) {
            reject("[inpage.js]: no response received");
          } else if (response.error) {
            reject(response.error ?? "Error");
          } else {
            console.log("[inpage.js]: response: ", response);
            resolve(response);
          }
        }
      });
    });
  }
}

window.spika = new SpikaWeb3();
