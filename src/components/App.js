
import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css'
import Meme from '../abis/Meme.json'


const ipfsClient = require('ipfs-http-client') //const ipfs = ipfsClient('http://localhost:5001') // (the default in Node.js)
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

 async loadWeb3() {
//loads web3
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

   async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]
   if(networkData) {
      const contract = web3.eth.Contract(Meme.abi, networkData.address)
      this.setState({ contract })
      const memeHash = await contract.methods.get().call()
      this.setState({ memeHash })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

constructor(props) {
  super(props);
  this.state = {
    account: null,
    buffer: null,
    contract: null,
    memeHash: 'QmX5CYcDCZwn4qed5rzGAept6G1fgwZAvdkNgXRN6BN3Sr'
  };
}

//digital signature

/* > {
    address: '0x3f243FdacE01Cfd9719f7359c94BA11361f32471',
    privateKey: '0x107be946709e41b7895eea9f2dacf998a0a9124acbb786f0fd1a826101581a07',
    publicKey: 'bf1cc3154424dc22191941d9f4f50b063a2b663a2337e5548abea633c1d06ece...'
} */

//multisig encrytion

//mulitsig decryption
//digital signature verification

//EXTRA: list certificates
//EZTRA: list Signers




//handles file loader events
  captureFile =(event) => {
    event.preventDefault()
    console.log('file captured...')// prints current behavoir to the form
    //process file for ipfs
    const file =event.target.files[0]//fetches file from the event.
    const reader = new window.FileReader()//FileReader comes with Project. Allows for converting to a buffer.
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({buffer: Buffer(reader.result)})// convertered to what needs to be sent to IPFS
      console.log('buffer', this.state.buffer)
    }
  }

  // handles submit events
  // EX. hash: QmV3A9Fo1qz2f8a7amMQoQjzh97mrKNDpBM5LiNkp1qu4E
  //Example URL: https://ipfs.infura.io/ipfs/QmV3A9Fo1qz2f8a7amMQoQjzh97mrKNDpBM5LiNkp1qu4E
    onSubmit = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {// adds the image to ipfs
      console.log('Ipfs result', result)//prints out UPFS results
      if(error) {
        console.error(error)//prints out error
        return
      }
      //Step 2: stores a file on blockchain
       this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
         return this.setState({ memeHash: result[0].hash })
       })
    })
  }

   render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shule
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a 
                  href="https://ipfs.infura.io/ipfs/QmX5CYcDCZwn4qed5rzGAept6G1fgwZAvdkNgXRN6BN3Sr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} />
                </a>
                <p>&nbsp;</p>
                <h2>Upload your certficate</h2>
                <form onSubmit={this.onSubmit} >
                  <input type='file' onChange={this.captureFile} />
                  <input type='submit' />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;