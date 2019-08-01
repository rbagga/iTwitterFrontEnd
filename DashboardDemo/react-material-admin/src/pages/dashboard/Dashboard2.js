import React , {Component, componentWillMount} from "react";
import Widget from "../../components/Widget";
import axios from 'axios';
import Button from '@material-ui/core/Button'
export default class Dashboard2 extends Component{
  constructor(props){
    super(props);
    this.state = {
      sessions: [],
      updateInterval: 100000
    }
  }


async componentDidMount(){

  const apiTest = await axios({
     method: 'GET',
     url: 'http://localhost:5000/SessionInformation/',
     headers: {
       'Access-Control-Allow-Origin':'True',
       'Content-Type':'application/json',
       'Authorization':('Bearer ' + localStorage.id_token)
     }
  });

  console.log(apiTest)
  this.setState({sessions: JSON.parse(apiTest.data)})
  this.interval = setInterval(async ()=>
  {
    const apiTest = await axios({
       method: 'GET',
       url: 'http://localhost:5000/SessionInformation/',
       headers: {
         'Access-Control-Allow-Origin':'True',
         'Content-Type':'application/json',
         'Authorization':('Bearer ' + localStorage.id_token)
       }
    });

    console.log(apiTest)
    this.setState({sessions: (apiTest.data)});
  }, this.state.updateInterval);


  }

  goToClass(){
    // console.log("COURSE NUMBER: " + course_number)
    window.location.href = "http://localhost:3000/app/session"
  }

  render(){
    console.log((this.state.sessions)[0]);
    // const x = []
    // for (const i in this.state.sessions){
      // x.push(this.state.sessions[i])
    // }
    // console.log(x)
    return(
      <div>
        <div>
          <h1>
            Your Classes:
          </h1>
        </div>
        {this.state.sessions.map((session)=>
          <Widget
            title = {session.course_number}
          >
            {session.term}
          </Widget>
        )}
        <Button onClick = { () => this.goToClass()}>
          Join Session
        </Button>

      </div>
    );
  }
}
