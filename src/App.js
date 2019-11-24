
import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react'
import { Row, Col, Card, Button, Form } from "react-bootstrap";
// import PropTypes from 'prop-types'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: {},
      igName: "",
      isSubmiting:false
    };
  }

  nrFormat(nr){
    if(nr >= 1000000000){
      return (nr/1000000000).toFixed(1).replace(/\.0$/,'') + 'G';
    }
    if(nr >= 1000000){
      return (nr/1000000).toFixed(1).replace(/\.0$/,'') + 'M';
    }
    if(nr >= 1000){
      return (nr/1000).toFixed(1).replace(/\.0$/,'') + 'K';
    }
    return nr;
  }
  
  onChange =(event)=> {
    event.preventDefault();

    this.setState({
      igName: event.target.value.toLowerCase()
    });
  }

  handleSubmit=(event)=>  {
    
    event.preventDefault();
    this.setState({
      isSubmiting:true
    });

    fetch(`https://www.instagram.com/${this.state.igName}?__a=1`)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          items: result,
          isSubmiting:false
        });

      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          isLoaded: true,
          isSubmiting:false,
          error
        });
      }
    )


  }

  controllFake = (item)=>{

    const {items}=this.state
    let nrLikes=0

    item.edges.map(node => {nrLikes += node.node.edge_liked_by.count   }) 
    nrLikes=nrLikes/item.edges.length
     return( <div>
          <p> Avarage of likes : {nrLikes.toFixed(1)}</p>
     <p> Percentage  of followers that likes posts {(nrLikes/items.graphql.user.edge_followed_by.count).toFixed(2)*100}%</p>
  <p>Based on instagram analytic this account {nrLikes/items.graphql.user.edge_followed_by.count<(1/20)*items.graphql.user.edge_followed_by.count? "has":"has not"} fake followers</p>
           </div>   )

  }
  render() {
    const {isSubmiting,items}=this.state
    return (
      <div>
        <div className="App">
          <div className="container" style={{ padding: "50px" }}>
            <div className="row">
              <Form   onSubmit={this.handleSubmit} > 
                <Form.Group as={Row} controlId="formPlaintextPassword">
                  <Form.Label column sm="2">
                    Put yout IG name, it must be a public one
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control type="text" placeholder="Put yout IG name" onChange={this.onChange}  />
                  </Col>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isSubmiting}>
                  Submit
                </Button>
              </Form>
            </div>
            <Row>
              <Col>
                {items && items.logging_page_id ?
                  <div>
                  <p>Based in the name u putted we found a Profile Page : {items.logging_page_id} , a {items.graphql.user.is_private? "Private account":"Public account"} </p>
                  <p> With A full name : <span style={{color:"#000", textDecoration:"underline", fontWeight:"600"}}> {items.graphql.user.full_name}</span></p>
                  <p>Nr of following :<span style={{color:"#000", textDecoration:"underline", fontWeight:"600"}}> {this.nrFormat(items.graphql.user.edge_follow.count)}</span></p>
                  <p>   Nr of followers :<span style={{color:"#000", textDecoration:"underline", fontWeight:"600"}}> {this.nrFormat(items.graphql.user.edge_followed_by.count)}</span></p>
                  {items.graphql.user.is_private ? " Can't find if has fake followers or not" : 
                  this.controllFake(items.graphql.user.edge_owner_to_timeline_media)        
                  }
                  </div>

                : ""
                }
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}
export default App

