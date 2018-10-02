import React from 'react';

class Dashboard extends React.Component{
  onLogout = event => {
    event.preventDefault();
    fetch('/account/me/token',{
      method : 'DELETE'
    });

  }

  render(){
    return(
      <div>
      <button onClick= {this.onLogout}>Logout</button>
      </div>
    )
  }
}

export default Dashboard;
