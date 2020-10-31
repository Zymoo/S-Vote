# s-vote

## Run blockchain locally (with MongoDB fallback)

Local blockchain follows the architecture of production environemnt. It consists of 4 containers, one server and three miner nodes. This network uses Proof of Authority. New blocks are published if there exist pending transactions.

To run ethereum network locally (one server node + 3 miner nodes) follow below steps:
0. `cd` into this project root directory
1. `cd blockchain`
2. `docker-compose up` — this will start 6 containers, four running `geth`, 2 running `mongoDB` and its web interface, and show their logs. To pause just use `Ctr+C` and resume containers using `docker-compose up` again — internal state of the containers (blockchain) will be preserved
3. `docker-compose down` — this will shutdown and remove the containers deleting their internal state (blockchain)

### Run block explorer

To run block explorer:
0. `cd` into this project root directory
1. `cd blockchain`
2. `docker-compose -f docker-compose-explorer.yml pull`
3. `docker-compose -f docker-compose-explorer.yml up` — this will start 4 containers creating Epirus Block Explorer (it may take some time to start)

Block explorer is available at `http://localhost/` (default port).

### Interact with MongoDB
**[Important]**  
Two connect to container-based MongoDB instance just run `npm start`.  
**[Important]**

Two MongoDB containers are running — one with database, and one with web interface.

Database can be explored at `http://localhost:8081/db/admin/`. Database is exposed on port `27017` (eg. for connecting via mongoDB client).

### Interact with blockchain
All blockchain nodes can be interacted with using `geth` on your host machine (you need to install it yourself — https://geth.ethereum.org/docs/install-and-build/installing-geth)

To attach to a node use `geth attach http://127.0.0.1:PORT` — each node has it's own port.

### Nodes info

| NODE NAME |  PORT |  CONTAINER IP  |               ADDRESS/PUBLIC KEY            |
|-----------|-------|----------------|---------------------------------------------|
| server    |  8880 |  172.16.238.10 |  0xa5EFDe8c0F99b444dFC9c415A98ab93D5Dc2ac9F |
| node1     |  8881 |  172.16.238.11 |  0x6e94d071E5274Bdfec7c6c7aEbBb8c7c230ab271 |
| node2     |  8882 |  172.16.238.12 |  0xD2640f08100b1aF79b86995B04c6bcF98EbB4d3c |
| node3     |  8883 |  172.16.238.13 |  0x3B7E744E81751025B6A772211d32F57670dD0F47 |

### Useful geth commands

After attaching to the node console use below commands. More commands at https://geth.ethereum.org/docs/rpc/ns-admin (see table on the left with different namespaces).

* `admin.peers` — show peers (other nodes) this node is connected to

* `admin.nodeInfo` — show node information

* `eth.getBalance(address)` — show ETH balance of given account, eg. get ETH balance of *node2* `eth.getBalance("0xD2640f08100b1aF79b86995B04c6bcF98EbB4d3c")`

* `eth.sendTransaction({from: address, to: address, value: amount})` — send transaction from unlocked address (adress of the attached node) to other account, eg. sending 1000 ETH from *server* to *node2*: `eth.sendTransaction({from: "0xa5EFDe8c0F99b444dFC9c415A98ab93D5Dc2ac9F",to: "0xD2640f08100b1aF79b86995B04c6bcF98EbB4d3c", value: "1000"})`