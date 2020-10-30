const express = require("express");
const socket = require("socket.io");
const app = express();
const WebSocket = require("ws");

const server = app.listen(4000);
const io = socket(server);

const first = io.of("/BINANCE_LTCBTC");
const second = io.of("/BINANCE_BNBBTC");

//for first bitcoin 
first.on("connection", (socket) => {
  const source = new WebSocket("wss://ws.finnhub.io?token=budvp0v48v6vkac8v6jg");
  source.addEventListener("open", function (event) {
    source.send(
      JSON.stringify({ type: "subscribe", symbol: "BINANCE:LTCBTC" })
    );
  });

  console.log("Connected one");
  let interval;

  //defining the event for first bitcoin data
  source.addEventListener("message", function (event) {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      let temp = JSON.parse(event.data);
      if (temp.type === "trade") {
        first.emit("priceData", event.data);
        console.log("Data for BINANCE:LTCBTC ", temp.data);
      }
    }, 2000);
  });
  socket.on('disconnect', () => {
    console.log("Disconnected one ");
    source.send(JSON.stringify({ type: "unsubscribe", symbol: "BINANCE:LTCBTC" }));
    source.close();
  });
});


//For Second BitCoin Data 
second.on("connection", (socket) => {
    //connecting to source 
  const source = new WebSocket("wss://ws.finnhub.io?token=budvp0v48v6vkac8v6jg");


  //connecting to respective bitcoin 
  source.addEventListener("open", function (event) {
    source.send(
      JSON.stringify({ type: "subscribe", symbol: "BINANCE:BNBBTC" })
    );
  });

  console.log("Connected two");
  let interval;

  //defining event for fetching the details 
  source.addEventListener("message", function (event) {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
        let tem = JSON.parse(event.data);
        if (tem.type === "trade") {
          second.emit("priceData", event.data);
          console.log("Data for BINANCE:BNBBTC ", tem.data);
        }
      }, 2000);
    
  });
  socket.on('disconnect', () => {
    console.log("Disconnected two");
    source.send(JSON.stringify({ type: "unsubscribe", symbol: "BINANCE:BNBBTC" }));
    source.close();
  });

 
});