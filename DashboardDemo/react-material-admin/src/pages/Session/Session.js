import React , {Component, componentWillMount} from "react";
import Widget from "../../components/Widget";
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Textarea from 'react-textarea-autosize';

export default class Session extends Component{
  constructor(props){
    super(props);
    this.state = {
      instructor_questions: [],
      student_questions: [],
      textInput: "",
      updateInterval: 2000
    }
  }

  async componentDidMount(){
    console.log("MOUNT MOUNT");
    console.log(localStorage.id_token)
    const inst_ques = await axios({
      method: 'GET',
      url: 'http://localhost:5000/I-ClickerQuestions/',
      headers: {
        'Access-Control-Allow-Origin':'True',
        'Content-Type':'application/json',
        'Authorization':('Bearer ' + localStorage.id_token)
      }
    });

    this.setState({instructor_questions: (inst_ques.data)});

    const stud_ques = await axios({
      method: 'GET',
      url: 'http://localhost:5000/StudentQuestions/',
      headers: {
        'Access-Control-Allow-Origin':'True',
        'Content-Type':'application/json',
        'Authorization':('Bearer ' + localStorage.id_token)
      }
    });

    this.setState({student_questions: JSON.parse(stud_ques.data)});

    this.interval = setInterval(async ()=> {
      const inst_ques = await axios({
        method: 'GET',
        url: 'http://localhost:5000/I-ClickerQuestions/',
        headers: {
          'Access-Control-Allow-Origin':'True',
          'Content-Type':'application/json',
          'Authorization':('Bearer ' + localStorage.id_token)
        }
      });

      this.setState({instructor_questions: (inst_ques.data)});


      const stud_ques = await axios({
        method: 'GET',
        url: 'http://localhost:5000/StudentQuestions/',
        headers: {
          'Access-Control-Allow-Origin':'True',
          'Content-Type':'application/json',
          'Authorization':('Bearer ' + localStorage.id_token)
        }
      });

      // console.log(stud_ques.data)
      this.setState({student_questions: JSON.parse(stud_ques.data)});

    }, this.state.updateInterval);
  }


  answer(res){
    alert("ANSWERED: " + res);
    console.log(this.textarea.focus())
    console.log(this.textarea.value)
    console.log("ANSWERED:" + res);
    axios({
      method: 'POST',
      // url: 'http://10.192.223.40//IclickerReponse/',
      url: 'http://localhost:5000/IclickerReponse/',
      data: {
        response: res
      },
      headers: {
        'Access-Control-Allow-Origin':'True',
        'Content-Type':'application/json',
        'Authorization': ('Bearer ' + localStorage.id_token)
      }
    });
  }

  submitText(type){
    if (type == "code"){
      console.log("submitting code")
      axios({
        method: 'POST',
        url: 'http://localhost:5000/coding environment/',
        data: {
          code: this.textarea.value,
        },
        headers: {
          'Access-Control-Allow-Origin' : 'True',
          'Content-Type': 'application/json',
          'Authorization': ('Bearer ' + localStorage.id_token)
        }
      });
    } else {
      axios({
        method: 'POST',
        url: 'http://localhost:5000/StudentQuestions/',
        data: {
          question: this.textarea.value,
        },
        headers: {
          'Access-Control-Allow-Origin' : 'True',
          'Content-Type': 'application/json',
          'Authorization': ('Bearer ' + localStorage.id_token)
        }
      });
    }
  }

  upvotePost(qid){
    axios({
      method: 'PUT',
      url: ('http://localhost:5000/StudentQuestions/' + qid),
      headers: {
        'Access-Control-Allow-Origin':'True',
        'Content-Type':'application/json',
        'Authorization':('Bearer ' + localStorage.id_token)
      }
    });
  }

  deletePost(qid){
    alert("deleted " + qid)
    axios({
      method: 'DELETE',
      url:'http://localhost:5000/StudentQuestions/',
      data: {
        qid: qid,
      },
      headers: {
        'Access-Control-Allow-Origin':'True',
        'Content-Type':'application/json',
        'Authorization':('Bearer ' + localStorage.id_token)
      }
    });
  }
  render(){
    console.log(this.state.instructor)
    // console.log(this.state.instructor_questions);
    return(
      <div>
        <div style = {{width: '50%'}}>
          {this.state.instructor_questions.map((iquestion)=>
            <Widget
              title  = {iquestion.ques} >
            </Widget>)}

            <Button onClick = {() => this.answer(1)}>
              A
            </Button>

            <Button onClick = {() => this.answer(2)}>
              B
            </Button>

            <Button onClick = {() => this.answer(3)}>
              C
            </Button>

            <Button onClick = {() => this.answer(4)}>
              D
            </Button>

        </div>

        <div style = {{width: '50%', float: 'right'}}>
          {/*<Widget title = {'placeholder'}>
          </Widget>*/}
          {this.state.student_questions.map((sques)=>

            <div>

              <Widget title = {sques.ques}>
              {sques.upvotes}
              </Widget>

              <Button onClick = {() => this.upvotePost(sques.qid)}>
              +1
              </Button>
              <Button onClick = {() => this.deletePost(sques.qid)}>
              Delete
              </Button>
            </div>

          )}

           <Textarea inputRef={tag => (this.textarea = tag)}
           minRows = {6} maxRows = {10} autoFocus/>
           <Button onClick = {() => {this.submitText("code")}}>
            Submit Code
           </Button>
           <Button onClick = {() => {this.submitText("question")}}>
            Submit Question
           </Button>

        </div>

        <Button />
        <Button />
        <Button />
        <Button />
      </div>
    );
  }
}
