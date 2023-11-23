import './App.css';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {InputGroup,Toaster}from '@blueprintjs/core';

const AppToaster=Toaster.create({
  position:"bottom-left"
})
function App() {
  const [users, SetUsers] = useState([]);
  const [newName,SetNewName]=useState("");
  const [newEmail,SetNewEmail]=useState("");
  const [newWebsite,SetNewWebsite]=useState("");
  const [editingUser, setEditingUser] = useState(null);
 
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((json) => SetUsers(json))
  }, [])

  function handleAddUser(){
    const name=newName.trim();
    const email=newEmail.trim();
    const website=newWebsite.trim();

    

    if(name && email && website){
      fetch('https://jsonplaceholder.typicode.com/users',{
        method:"POST",
        body:JSON.stringify({
          name,
          email,
          website
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((response)=>response.json())
      .then((data)=>{
        SetUsers([...users,data]);
        AppToaster.show({
          message:"USER DATA HAS BEEN ADDED SUCESSFULY",
          intent:'success',
          timeout:3000
        })
        SetNewName("");
        SetNewEmail("");
        SetNewWebsite("");
      })
    }
  }

  

  function editText(id){
    const userToEdit = users.find((user) => user.id === id);
    setEditingUser(userToEdit);

    // Update the input fields with the values of the user to be edited
    SetNewName(userToEdit.name);
    SetNewEmail(userToEdit.email);
    SetNewWebsite(userToEdit.website);
  }

  function cancelEdit() {
    setEditingUser(null);
    SetNewName("");
    SetNewEmail("");
    SetNewWebsite("");
  }
  function update(){
    const updatedUsers = users.map((user) =>
      user.id === editingUser.id
        ? { ...user, name: newName, email: newEmail, website: newWebsite }
        : user
    );

    fetch(`https://jsonplaceholder.typicode.com/users/10`, {
      method: "PUT",
      body: JSON.stringify({
        id: editingUser.id,
        name: newName,
        email: newEmail,
        website: newWebsite,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        SetUsers(updatedUsers);
        AppToaster.show({
          message: "USER DATA HAS BEEN UPDATED SUCCESSFULLY",
          intent: "success",
          timeout: 3000,
        });
        cancelEdit(); // Reset editing state and clear input fields
      });
  }
  function deleteText(id){
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");

    if (isConfirmed) {
      const updatedUsers = users.filter((user) => user.id !== id);

      fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          SetUsers(updatedUsers);
          AppToaster.show({
            message: "USER DATA HAS BEEN DELETED SUCCESSFULLY",
            intent: "success",
            timeout: 3000,
          });
        });
    }
  }
  return (
    <>
      <div className="container-fluid container-md">
        <h2 className='text-primary text-center mb-5'>CRUD APPLICATION IN REACT JS</h2>
        <div className="row justify-content-center">
          <div className="col">
            <table className='table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Website</th>
                  <th className='text-center'>Action</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((value) =>
                  <tr key={value.id}>
                    <td>{value.id}</td>
                    <td>{value.name}</td>
                    <td>{value.email}</td>
                    <td>{value.website}</td>
                    <td><button type="button" className="btn btn-primary" onClick={()=>editText(value.id)}>EDIT</button></td>
                    <td><button type="button" className="btn btn-danger" onClick={()=>deleteText(value.id)}>DELETE</button></td>
                  </tr>
                )}

              </tbody>
              <tfoot className='my-5'>
                <tr>
                  <td></td>
                  <td><InputGroup
                  value={newName}
                  onChange={(e)=>SetNewName(e.target.value)}
                  placeholder='Enter name...'
                  /></td>
                  <td><InputGroup
                  value={newEmail}
                  onChange={(e)=>SetNewEmail(e.target.value)}
                  placeholder='Enter email...'
                  /></td>
                  <td><InputGroup
                  value={newWebsite}
                  onChange={(e)=>SetNewWebsite(e.target.value)}
                  placeholder='Enter website...'
                  /></td>
                  {editingUser ?(
                    <>
                    <td><button type="button" className="btn btn-warning" onClick={()=>update()}>UPDATE</button></td>
                    <td><button type="button" className="btn btn-danger" onClick={()=>cancelEdit()}>CANCEL</button></td>
                    </>
                  ) :(<>
                    <td className='text-center'><button type="button" className="btn btn-success " onClick={handleAddUser}>ADD USER</button></td>
                  </>)
                  }
                  
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </>


  );
}

export default App;
