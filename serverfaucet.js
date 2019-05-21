#!/usr/bin/env node

const chalk = require('chalk');
const http = require("http");
const os = require('os');
const transmitters = [];

const args = process.argv.slice(2);
const port = args.count > 0 ? args[0]:8080;



const server = http.createServer((req,res) => {
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        req.body = body;    
        let json = null;
        try {
            json = JSON.parse(req.body)
        } catch(e){}
        let log = "unknown ";
        let msg = req.body;
        if(json && json.id){
            log = json.id
            msg = json.msg
        }
        console.log(chalk.yellow(`${log} `),msg);
        res.writeHead(200,{"content-type":"text"});
        res.end();
    }).on('error', (err) => {    
        console.error(chalk.red(err.stack));
    });
});

server.listen(port, ()=>{
    console.log("Faucet Listener")
    const ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
          if ('IPv4' !== iface.family ) { return; }
          console.log(chalk.green(`\thttp://${iface.address}:${port}`));
        });
      });
})



