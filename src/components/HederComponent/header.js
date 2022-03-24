import React from 'react'
import {NavLink} from 'react-router-dom'

const Header = ({account,oncl,islogged,username,profileimg,logout}) => {
    return (
        
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

          <a className="navbar-brand" href="#">
            <img
              src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/logo_white.png"
              width="30"
              height="30"
              alt="logo"
              className="align-bottom"
            ></img>
            Boorable
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <NavLink exact activeClassName="active" to="/">
              <li className="nav-item active">
                <a className="nav-link">
                  Explore <span className="sr-only">(current)</span>
                </a>
              </li>
              </NavLink>
              <NavLink   to="/MyTokens">
              <li className="nav-item">
                <a className="nav-link">
                  My items
                </a>
              </li>
              </NavLink>
              <NavLink   to="/create">
              <li className="nav-item">
                <a className="nav-link">
                  {' '}
                  Create
                </a>
              </li>
              </NavLink>
              
            </ul>
            <ul className="navbar-nav">
            {islogged?(
                <li className="nav-item">
                
                <a className="nav-link" href="#">
                 {username}
                </a>
                </li>
                   
                ):(
                    <li className="nav-item">
                 <a className="nav-link" href="#">
                    {account}
                  </a>
                
              </li>
                   
                )}    
           
            
             {islogged?(
                
               
              
                <ul className="navbar-nav">
                    <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg" width="25" height="25" className="rounded-circle"></img>
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                      <a className="dropdown-item" href="#">Dashboard</a>
                      <a className="dropdown-item" href="#">Edit Profile</a>
                      <a className="dropdown-item" href="#">Log Out</a>
                    </div>
                  </li>
                  <li className="nav-item" >
              <button className="btn btn-primary"  onClick={logout}><i className="fa fa-sign-out"></i> logout</button>
              </li>)   
                </ul>
              

              
             
             ):( <li className="nav-item" >
              <button className="btn btn-primary"  onClick={oncl}><i className="fa fa-home"></i> login using metamask</button>
              </li>)
              }
              </ul>
          </div>
        </nav>
       
    )
}

export default Header
