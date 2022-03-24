import React, { Component } from 'react'
import axios from 'axios'
import Web3 from 'web3'
import './App.css'
import Meme from '../abis/Meme.json'
import NFTCollectible from '../abis/NFTCollectible.json'
import MarketContract from '../abis/MarketContract.json'
import '../style/main.css'
import { Button, Toast } from 'bootstrap'
import { data } from 'jquery'
import { FormLabel, Modal } from 'react-bootstrap'
import Header from './HederComponent/header'
import Createnft from './CreateNFTComponent/createnft'
import { setUserSession,removeUserSession, getToken, getUser } from './Utils/common'
import {BrowserRouter,Switch,Route} from 'react-router-dom'
import Home from './HomeComponent/home'
import MyTokenComponent from './MyTokenComponent/MyTokenComponent'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
}) // leaving out the arguments will default to these values

class App extends Component {


  constructor(props) {
    super(props)

    this.state = {
      memeHash: '',
      contract: null,
      marketcontract:null,
      marketcontractaddress:null,
      web3: null,
      buffer: null,
      account: null,
      data: [],
      showmodal: false,
      isloggedin:false,
      username:'',
      profileimg:'',
      email:'',
      token:'',
      pending_token_id:'',
      contract_address:''
    }
  }





  async componentWillMount() {
    
    await this.loadWeb3()
    await this.loadBlockchainData()
    this.isloggedin()
  }


  isloggedin=()=>{
    
    const tok=getToken()
    if(tok!=null){
     
      this.setState({token:tok})
      
    }else{
      this.setState({token:''})
    }
    const us=getUser()
  if(us!=null){

    this.setState({username:us.username})
    this.setState({email:us.email})
    this.setState({account:us.publicAddress})
  }else{

    this.setState({username:''})
    this.setState({email:''})
    // this.setState({account:''})

  }
    if(tok!=null){

      this.setState({isloggedin:true})

    }else{
      
      this.setState({isloggedin:false})

    }
    

  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!',
      )
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    this.setState({web3:web3})
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = NFTCollectible.networks[networkId]
    const networkData1 = MarketContract.networks[networkId]

    if (networkData && networkData1) {
      const contract = new web3.eth.Contract(
        NFTCollectible.abi,
        networkData.address,
      )

      const marketcontract = new web3.eth.Contract(
        MarketContract.abi,
        networkData1.address,
      )



      // contract.events.minted( (err, result)=> {
      //   if (err) {
      //     console.error(err)
      //     this.setState({pending_token_id:''})
      //   }
      //   var js = result.returnValues
      //   // console.log(' id '+js.token_id)
      //   // console.log('address of owner: ' + JSON.stringify(js))

        

      //   axios
      //   .post('http://127.0.0.1:4000/nft/updateNFT', {
      //     "id":this.state.pending_token_id,
      //     "token_id":js.token_id
      //   })
      //   .then(async(response)=> {
      //     console.log(response.data.data.tokenid)
      //     this.setState({pending_token_id:''})

      //     const res=await this.additemtomarketplace(response.data.data.tokenid,response.data.data.nft_price)
          
         
      //   }).catch((error)=>{
      //     console.log(error)
      //     this.setState({pending_token_id:''})
      //   })

      // })



      // marketcontract.events.itemAdded( (err, result)=> {

      //   if(err){
      //     console.log(err)
      //   }else{
  
      //     var js = result.returnValues
      //     this.pushauctionitemtodatatbase(js)
  
      //   }
  
      // })

      // const useraddress=getUser().publicAddress
      // var res=await this.state.marketcontract.methods.getitems().call({from:useraddress})
      // console.log(res)


      // marketcontract.events.itemSold({fromBlock:'latest'},(err, result)=>{
      //   if(err){
      //     console.log(err)
      //   }else{
      //     console.log("inside item sold")
      //     var js = result.returnValues
      //     this.pushsolditemtodatatbase(js)
      //   }
      // })




      this.setState({ contract })
      this.setState({marketcontract:marketcontract})
      this.setState({contract_address:networkData.address})
      this.setState({marketcontractaddress:networkData1.address})

      //listening to event

      

     
     



    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }





  purchaseItem=async(id,price)=>{
  
    
    try{
      const useraddress=getUser().publicAddress
      const receipt=await this.state.marketcontract.methods.buyItem(id).send({from:useraddress,value:price})
      console.log(receipt)
     const result= receipt.events.itemSold.returnValues;
     console.log(result)
     if(result!=null){
      const res=await this.pushsolditemtodatatbase(result)
      if(res){
        alert("successfully bought item ")
        return true
      }

     }

    }catch(err){
      console.log(err)
    }

  }







  



  additemtomarketplace=async(tokenid,tokenprice)=>{

   
  console.log(tokenprice)
  

    try{
      const useraddress=getUser().publicAddress
      let receipt=await this.state.marketcontract.methods.addItemtoMarket(tokenid,this.state.contract_address,tokenprice).send({from:useraddress})
      const result=receipt.events.itemAdded.returnValues;
      if(result!=null){

       const res= await this.pushauctionitemtodatatbase(result)
       if(res){

       }

      }


    }catch(err){
      console.log(err)
    }

  }


  isMarketplaceApproved=async()=>{
    const useraddress=getUser().publicAddress
   
    const approvedaddress=await this.state.contract.methods.isApprovedForAll(useraddress,this.state.marketcontractaddress).call({from:useraddress})
    if(!approvedaddress){
      try{
        let result=await this.state.contract.methods.setApprovalForAll(this.state.marketcontractaddress,true).send({from:useraddress})

      return true;
      }
      catch(err){

        if(err.code=='4001'){
          alert("denied by user")
          return false;
          
        }

      }
      
     
    }else{
      return true;
    }

  }


  pushauctionitemtodatatbase=async(result)=>{

    const tok=getToken()
    const useraddress=getUser().publicAddress
    try{

      const res= await axios
        .post('http://127.0.0.1:4000/nft/addtosell', {
          "id":result.id,
          "token_id":result.tokenId,
          "price":result.askingPrice,
          "tokenAddress":result.tokenAddress,
          "marketaddress":this.state.marketcontractaddress,
          "useraddress":useraddress

        },{
          headers: {
            'Authorization': tok 
          }
        })

        const response=await res
        console.log(response.data)
        if(response.data.message=="success"){
          alert("successfully added item to marketplace")
          return true;
        }

      }catch(err){

        console.log(err)

      }



  }



  pushsolditemtodatatbase=async(result)=>{

    console.log("inside push item sold")

    const tok=getToken()
    const useraddress=getUser().publicAddress
    try{

      const res= await axios
        .post('http://127.0.0.1:4000/nft/addtosold', {
          "id":result.id,
          "token_id":result.tokenId,
          "price":result.askingPrice,
          "tokenAddress":result.tokenAddress,
          "marketaddress":this.state.marketcontractaddress,
          "sellerId":result.seller,
          "buyerId":useraddress


        },{
          headers: {
            'Authorization': tok 
          }
        })

        const response=await res
        console.log(response.data)
        if(response.data.message=="successfly bought nft"){
          return true;

        }

      }catch(err){

        console.log(err)

      }


     



  }




 

  signup = () => {
    var acc = this.state.account
    console.log(acc)
    const headers = {
      'Content-Type': 'application/json',
    }
    axios
      .post('http://127.0.0.1:4000/users/get', {
        publicAddress: acc,
      })

      .then((res) => {
        //verify and sign
        const persons = res.data
        var p = persons.data
        console.log(p.length)
        if(p.length>0){
          p = p[0]
        
        if (p.user_nonce) {
          var add = this.state.account
          var nonce = p.user_nonce
          this.handleSignMessage(add, nonce).then(this.handleAuthenticate)
        } else {
          console.log('undefined')
        }
        }else{
          this.setState({ showmodal: true })
        }
        
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status == 404) {
            //create new user
          }
        }
      })
  }

  handleSignMessage = (publicAddress, nonce) => {
   
    const web3 = window.web3
    return new Promise((resolve, reject) =>
      web3.eth.personal.sign(
        web3.utils.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
        publicAddress,
        (err, signature) => {
          if (err) return reject(err)
          return resolve({ publicAddress, signature })
        },
      ),
    )
  }

  handleAuthenticate = ({ publicAddress, signature }) => {
    console.log('succesfully signed')
    axios
      .post('http://127.0.0.1:4000/users/auth/', {
        publicAddress: publicAddress,
        signature: signature,
      })
      .then((response)=> {
        console.log(response)
        var data=response.data
        if(data.message=="successful signup")
        {
         if(this.state.showmodal){
          this.setState({ showmodal: false })
         }
         
         setUserSession(data.token,data.data)
         this.isloggedin()
        }
      }).catch((error)=>{

      })
  }


  handleLogout=()=>{

    removeUserSession()
    this.isloggedin()
  }

  

  captureFile = (event) => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }



  
  onSubmit = async(event) => {
    event.preventDefault()
    const res=await this.isMarketplaceApproved()
    console.log(res)
   
    if(res==true){
     
        console.log('Submitting file to ipfs...')
        ipfs.add(this.state.buffer, (error, result) => {
          console.log('Ipfs result', result)
          if (error) {
            console.error(error)
            return
          }
          this.isMarketplaceApproved()
          this.sendmetadata(result[0].hash)
          
        })
    }else{
      alert("permission denied market will not be able sell your item!!")
    }
  }




  sendmetadata = (hash) => {
    var name=document.getElementById('name').value
    var description= document.getElementById('Description').value
    var by=document.getElementById('Creator').value
    var price=document.getElementById('Price').value
    
    var msg = {
      name: document.getElementById('name').value,
      image: 'https://ipfs.infura.io/ipfs/'+hash,
      description: document.getElementById('Description').value,
      by: document.getElementById('Creator').value
      
    }
    

    // convert JSON object to String
    var jsonStr = JSON.stringify(msg)
    console.log(jsonStr)

    // read json string to Buffer
    const buf = Buffer.from(jsonStr)

    ipfs.add(buf, (error, result) => {
      console.log('Ipfs result meta', result)
      if (error) {
        console.error(error)
        return
      }
      else{

        axios
        .post('http://127.0.0.1:4000/nft/createNFT', {
          "name":name,
          "description":description,
          "creator":by,
          "price":price,
          "asset_hash":hash,
          "asset_filepath":"https://ipfs.infura.io/ipfs/"+hash,
          "metadata_hash":result[0].hash,
          "metadata_filepath":"https://ipfs.infura.io/ipfs/"+result[0].hash,
          "publicAddress":this.state.account,
          "contract_address":this.state.contract_address

        })
        .then((response)=> {

        this.setState({pending_token_id:response.data.data})

        const tokenid=this.mintnft(result[0].hash,hash)
        
         
        }).catch((error)=>{
          console.log(error.message)
        })

      }
      
    })
  }


  mintnft=async(metahash,asset_hash)=>{

  const receipt= await this.state.contract.methods.mint(asset_hash,metahash,"https://ipfs.infura.io/ipfs/"+metahash).send({ from: this.state.account })
  console.log(receipt)

  const result=receipt.events.minted.returnValues;
  if(result!=null){

    axios
    .post('http://127.0.0.1:4000/nft/updateNFT', {
      "id":this.state.pending_token_id,
      "token_id":result.token_id
    })
    .then(async(response)=> {
      console.log(response.data.data.tokenid)
      this.setState({pending_token_id:''})
      const res=await this.additemtomarketplace(response.data.data.tokenid,response.data.data.nft_price)
      
     
    }).catch((error)=>{
      console.log(error)
      this.setState({pending_token_id:''})
    })


  }

  }






  renderOverlay = () => {
    return (
      <div className="Container"
        style={{
          position: 'fixed',
          height: '500px',
          width: '500px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          zIndex:'10'

        }}
      >

        <h3 style={{textAlign:'center',marginTop:'10px'}}>Signup</h3>
<div className="container">
        <form onSubmit={this.onSubmitform}>
          <FormLabel for="email">Email</FormLabel>
          <input id="email" name="email" type={Text}></input>
<br></br>
          <FormLabel for="username" >username</FormLabel>
          <input id="username" type={Text} name="username"></input>
          <input type="submit" className="login" />
        </form>
        </div>
    
      </div>
    )
  }


  onSubmitform=(event)=>{
   
    event.preventDefault()
    console.log(event.target.username.value)
    console.log(event.target.email.value)
    axios
      .post('http://127.0.0.1:4000/users/create', {
        username: event.target.username.value,
        email: event.target.email.value,
        publicAddress:this.state.account
      })
      .then((response)=>{
       var dat=response.data
       this.processdata(this.state.account,dat.data)
       
       })
      


  }

  processdata=(address,nonce)=>{

    this.handleSignMessage(address, nonce).then(this.handleAuthenticate)
  }



  render() {
    return (

      <div className="content">
        
        {this.state.showmodal ? this.renderOverlay() : null}
        <BrowserRouter>
       <Header account={this.state.account} oncl={this.signup} islogged={this.state.isloggedin} username={this.state.username} profileimg={this.state.profileimg} email={this.state.email} logout={this.handleLogout}></Header>
       <Switch>
         <Route exact path="/" >
           <Home web3={this.state.web3} purchaseItem={this.purchaseItem}></Home>
         </Route>
         <Route exact path="/MyTokens" >
         <MyTokenComponent  getdata={this.gettokencount} web3={this.state.web3} addomarket={this.additemtomarketplace}></MyTokenComponent>
         </Route>
         <Route  path="/create" >
         <Createnft nftformsubmit={this.onSubmit} fileupload={this.captureFile} tokencount={this.gettokencount} data={this.state.data}></Createnft>
         </Route>

       </Switch>
       
       </BrowserRouter>
      </div>
    )
  }
}

export default App
