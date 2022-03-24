import React, { Component,useState } from 'react'


const Createnft=({nftformsubmit,fileupload,tokencount,data})=>{
    return(
<div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a href="" target="_blank" rel="noopener noreferrer">
                 
                </a>

                <div className="panel">
                  <div className="state">
                    <br></br>
                    <i className="fa fa-unlock-alt"></i>
                    <br></br>
                    <h1>Mint a NFT</h1>
                  </div>
                  <div className="form">
                    <form onSubmit={nftformsubmit}>
                      <input
                        type="text"
                        id="name"
                        placeholder="Name of NFT"
                      ></input>
                      <input
                        type="text"
                        id="Description"
                        placeholder="Description of NFT "
                      ></input>
                      <input
                        type="text"
                        id="Creator"
                        placeholder="Creator of NFT "
                      ></input>
                      <input
                        type="text"
                        id="Price"
                        placeholder="Price of NFT "
                      ></input>
                      <br></br>
                      <input type="file" onChange={fileupload} />

                      <input type="submit" className="login" />
                    </form>
                   
                  </div>
                  {/* <button className="login" onClick={tokencount}>
                    get token count
                  </button> */}
                </div>
                

                {/* <div className="row">
                  {data.map((d) => (
                    <div className="column" key={d.id}>
                      <div className="card mb-4">
                        <div className="card-img-block">
                          <img
                            className="card-img-top"
                            src={`https://ipfs.infura.io/ipfs/${d.asset_hash}`}
                            alt="Card image cap"
                          ></img>
                          <button className="btn btn-primary mt-3">
                            Add to sell listing
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div> */}
                
              </div>
            </main>
          </div>
        </div>

        
    )
}


export default Createnft