import { Button, Toast } from 'bootstrap'
import React from 'react'
import { setUserSession,removeUserSession, getToken, getUser } from '../Utils/common'
import axios from 'axios'
import {useEffect,useState} from 'react'
import { Modal }  from '../ModalComponent/Modal';
import { GlobalStyle } from './globalstyles';
import styled from 'styled-components';





const MyTokenComponent = ({web3,addomarket}) => {
   
  const [data, setdata] = useState([])
  const [item_data,setitemdata]=useState([])
  const [showModal, setShowModal] = useState(false);

  

 


  useEffect(() => {
    let mounted = true;
  
    const tok=getToken()
    const us=getUser()
  
    axios
    .post('http://127.0.0.1:4000/nft/getNFT', {
      "user_id":us.userid
      
    }, {
      headers: {
        'Authorization': tok 
      }
    }).then(res=>{
  
      
      if(mounted) 
      {
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

     var response=fetch(data[i].metadata_filepath)
     .then(response=>response.json())
     .then(data=>{
       arr.push(data)

     })
     
      
      
    }

    return arr

  }


  
  const openModal = () => {
    setShowModal(prev => !prev);
  };

 
  

    return (
      <>
       <div className="row">
                  {data.map((d) => {

                    if(d.status && d.price!=null){
                      return  <div className="column" key={d.id}>
                        
                      <div className="card mb-4" style={{maxHeight:"450px",minHeight:"450px",width:"300px",borderRadius:"10px"}}>
                        <div className="card-img-block">
                          <img
                            className="card-img-top"
                            src={`https://ipfs.infura.io/ipfs/${d.asset_hash}`}
                            alt="Card image cap"
                          ></img>


                          
                        
                        <p>Name: {d.description}</p>
                        <p>by: {d.creator}</p>
                        
                        <div> 
                          <p>Status: Added to Marketplace for {web3.utils.fromWei(d.price, 'ether')} ETH</p>
                          <button className="btn btn-primary mt-3">Edit Listing</button>
                          <br></br>
                          </div>
                        </div>
                      </div>
                    </div>

                    }else if(d.status && d.price==null){

                      return  <div className="column" key={d.id}>
                        
                      <div className="card mb-4" style={{maxHeight:"450px",minHeight:"450px",width:"300px",borderRadius:"10px"}}>
                        <div className="card-img-block">
                          <img
                            className="card-img-top"
                            src={`https://ipfs.infura.io/ipfs/${d.asset_hash}`}
                            alt="Card image cap"
                          ></img>


                          
                        
                        <p>Name: {d.description}</p>
                        <p>by: {d.creator}</p>
                        
                        <div> 
                        <button className="btn btn-primary mt-3" onClick={openModal}>Add to Markletplace</button>
                        <Modal showModal={showModal} setShowModal={setShowModal} item={d} addtomarket={addomarket}/>
                        <GlobalStyle />
                          <br></br>
                          </div>
                        </div>
                      </div>
                    </div>

                    }else if(!d.status){


                      return  <div className="column" key={d.id}>
                        
                      <div className="card mb-4" style={{maxHeight:"450px",minHeight:"450px",width:"300px",borderRadius:"10px"}}>
                        <div className="card-img-block">
                          <img
                            className="card-img-top"
                            src={`https://ipfs.infura.io/ipfs/${d.asset_hash}`}
                            alt="Card image cap"
                          ></img>


                          
                        
                        <p>Name: {d.description}</p>
                        <p>by: {d.creator}</p>
                        
                        <div> 
                        <p>Status: Pending (Not minted)</p>
                          <button className="btn btn-primary mt-3">Mint</button>
                          <br></br>
                          </div>
                        </div>
                      </div>
                    </div>

                    }
                    
                  })}
                </div>
                </>
    )
}

export default MyTokenComponent
