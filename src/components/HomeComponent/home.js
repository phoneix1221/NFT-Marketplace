import { Toast } from 'bootstrap'
import React from 'react'
import { setUserSession,removeUserSession, getToken, getUser } from '../Utils/common'
import axios from 'axios'
import {useEffect,useState} from 'react'





const Home = ({web3,purchaseItem}) => {
   
  const [data, setdata] = useState([])
  const [item_data,setitemdata]=useState([])

 


  useEffect(() => {
    let mounted = true;
  
    const tok=getToken()
    const us=getUser()
  
    axios
    .get('http://127.0.0.1:4000/nft/getitemstosell', {
      headers: {
        'Authorization': tok 
      }
    }).then(res=>{
  
      
      if(mounted) 
      {
         
        console.log(res.data.data)
              setdata(res.data.data)
              var arr=getitemdata(res.data.data)
              setitemdata(arr)
              
    }
  
    }).catch(error=>{
  
  
    })




    return () => mounted = false;
  }, [])



  function getitemdata(data){



    var arr=[];
    for(var i=0;i<data.length;i++){
    
    
     var response=fetch(data[i].nftToken.metadata_filepath)
     .then(response=>response.json())
     .then(data=>{
       arr.push(data)
       
     })
     
      
      
    }

    return arr

  }



 
  

    return (
      
       <div className="row">
                  {data.map((d,index) => {

                    if(getUser()!=null && d.user_table.user_profile.publicAddress!=getUser().publicAddress){

                      return <div className="column" key={d.id}>
                        
                        <div className="card mb-4" style={{maxHeight:"450px",minHeight:"450px",width:"300px",borderRadius:"10px",backgroundColor:'black'}}>
                        <div className="card-img-block">
                          <img
                            className="card-img-top"
                            src={`https://ipfs.infura.io/ipfs/${d.nftToken.asset_hash}`}
                            alt="Card image cap"
                          ></img>    
                        <p style={{color:'white'}}>Name: {d.nftToken.name}</p>
                        <p style={{color:'white'}}>Creator: {d.nftToken.creator}</p>
                        <p style={{color:'white'}}> Owner:{d.user_table.username}</p>
                        <button className="btn btn-primary mt-3" onClick={async()=>{ const res= await purchaseItem(d.auctionitemid,d.nftToken.price)
                        if(res){
                          
                          setdata(data.splice(index))

                        }  
                        
                        }}>
                      Buy for {web3.utils.fromWei(d.nftToken.price, 'ether')} ETH
                    </button>
                        </div>
                      </div>
                    </div>

                    }else if(getUser()==null){
                      return <div className="column" key={d.id}>
                        
                      <div className="card mb-4" style={{maxHeight:"450px",minHeight:"450px",width:"300px",borderRadius:"10px",backgroundColor:'black'}}>
                        <div className="card-img-block">
                          <img
                            className="card-img-top"
                            src={`https://ipfs.infura.io/ipfs/${d.nftToken.asset_hash}`}
                            alt="Card image cap"
                          ></img>    
                        <p style={{color:'white'}}>Name: {d.nftToken.name}</p>
                        <p style={{color:'white'}}>Creator: {d.nftToken.creator}</p>
                        <p style={{color:'white'}}> Owner:{d.user_table.username}</p>
                        <button className="btn btn-primary mt-3">
                      Buy for {web3.utils.fromWei(d.nftToken.price, 'ether')} ETH
                    </button>
                        </div>
                      </div>
                    </div>
                    }
              
                    
                  })}
                </div>
    )
}

export default Home
