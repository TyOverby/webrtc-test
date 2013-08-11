// Get our peerjs object
var peerjs = require('peerjs-browserify-unofficial');

// Out of the many utilities exported, we just want
// the base Peer object used in the peerjs demos.
var Peer = peerjs.Peer;

// Turn debug-level logging on
peerjs.util.debug = true;

// PUT YOUR OWN API KEY HERE
var API_KEY = prompt("API key goes here.");


//////////////////////////////////////////
// THE FOLLOWING IS JUST MY STUPID DEMO //
//////////////////////////////////////////

var valueGen = function (id) {
    var ele = document.querySelector("#" + id);
    return function () {
        return ele.value;
    }
}

var getName = valueGen("name");
var getRange = valueGen("range");
var getPeer = valueGen("peer");

var buttonEle = document.querySelector("button");
var rangeEle = document.querySelector("#range");

var exports = {};

buttonEle.onclick = function () {
    var peer = new Peer(getName(), {key: API_KEY});
    exports.peer = peer;
    if(getPeer().length !== 0) {
        var conn = peer.connect(getPeer());
        exports.conn = conn;
        conn.on('open', function(){
            conn.on('data', function (data) {
                rangeEle.value = data;
            });
            rangeEle.onchange = function () {
                conn.send(getRange());
            }
        });
    } else {
        peer.on('connection', function (conn){
            exports.conn = conn;

            conn.on('data', function (data) {
                rangeEle.value = data;
            });

            rangeEle.onchange = function () {
                conn.send(getRange());
            }
        });
    }
};
