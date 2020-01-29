 const Meme = artifacts.require("Meme");

 //require chai library
 require('chai')
 	.use(require('chai-as-promised'))
 	.should()

 contract('Meme', (accounts) => {
//Write all the test here.
	let meme

	describe('deployment', async () => {
		it('deploys successful', async () =>{
		meme = await Meme.deployed()
		const address = meme.address
		console.log(address)

		})
	})
 })