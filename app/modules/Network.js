import Packer from 'pypacker';

var networkTimer = null;

export default class Network {

    packer  = false;
    action  = false;
    socket  = false;
    port    = false;
    host    = false;

    buffers = [];
    expected= false;
    total   = false;
    stash   = false;

    onData  = function() {};
    onClose = function() {};
    onError = function() {};

    constructor(host, port, action, onData = false, onClose = false, onError = false, Live = false) {
        this.host    = String(host);
        this.port    = parseInt(port);
        this.action  = action;
        this.packer  = new Packer('>I');
        this.onData  = onData  ? onData  : this.onData;
        this.onClose = onClose ? onClose : this.onClose;
        this.onError = onError ? onError : this.onError;
        this.live    = Live;
    }

    receive(message) {
        if (!this.total) {
            
            const expectedLength = this.packer.unpack(new Buffer(message.slice(0,4)))[0];
            const messageLength = message.length - 4;
            
            if (expectedLength !== messageLength) {
                this.total = messageLength;
                this.expected = expectedLength;
                this.stash = message.subarray(4).toString();
            }
            else {
                this.buffers.push(message.subarray(4).toString())
            }
        }

        else {
            
            this.stash += message.toString();
            this.total += message.length;
            
            if (this.total === this.expected) {
                this.buffers.push(this.stash);
                this.expected = false;
                this.total = false;
                this.stash = false;
            }
        }

        if (this.buffers.length > 100) {
            this.buffers.shift();
        }
    }

    close = () => {
        if (this.socket) {
            this.socket.destroy();
            this.socket = false;
            this.onClose();
        }
    };

    send = (payload = false) => {
        if (!this.socket) {
            this.socket = new window.nodeNetObject.Socket({
                writable: true,
                readable: true,
                allowHalfOpen: true
            });

            this.socket.setTimeout(10000);

            this.socket.connect(this.port, this.host, () => {
                this.socket.write(this.packer.pack(String(this.action.length)) + this.action);
                if (payload) {
                    const chunked = payload.match(/[\s\S]{1,1024}/g);
                    let payloadLength = payload.length;
                    let packerText = this.packer.pack(String(payloadLength));

                    for (let i=0; i < chunked.length; i++) {
                        let payloadText = chunked[i];
                        if (i == 0) {
                            // Packer has bug for certain length integer!
                            payloadText = packerText + chunked[i];
                        }

                        setTimeout(() => {
                            this.socket.write(payloadText);
                        }, 100 * i);
                    }

                    // Force closing socket!
                    // Bug fix 4 bytes is not encoded properly on javascript!
                    setTimeout(() => {
                        this.close();
                    }, (100 * chunked.length) + 1000);
                }
            });

            this.socket.on('timeout', this.promiseClose);

            this.socket.on('end', this.promiseClose);

            this.socket.on('data', (data) => {
                this.receive(data);
                this.onData(this, this.buffers);
                clearTimeout(networkTimer);
            });

            this.socket.on('close', () => {
                clearTimeout(networkTimer);
                this.close();
                this.onClose(this, this.buffers);
            });

            this.socket.on("error", (err) => {
                clearTimeout(networkTimer);
                this.close();
                this.onError(this, err, this.buffers);
            });
        }
    };

    isConnected = () => {
        return this.socket ? this.socket.readable : false;
    };

    promiseClose = () => {
        networkTimer = setTimeout(() => {
            this.close();
            this.onClose(this, this.buffers);
        }, 1000);
    }
}