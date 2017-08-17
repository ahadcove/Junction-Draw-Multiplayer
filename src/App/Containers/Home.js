import React,{Component} from 'react';

class Home extends Component{
    constructor(){
        super();
        this.state = {
            name:'',
            color:''
        }
    }

    enter = () => {
        this.props.history.push("/draw", {name:this.state.name});
    }

    _handleInputChange = (e) =>{
        const value = e.target.value;
        const name = e.target.name;
        this.setState({
        [name]: value
        });
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            switch(e.target.name){
                case "name":
                this.enter();
                break;
                default:
                break;
            }
        }
    }

    render(){
        return(
            <div>
                Welcome To Junct Draw
                <div>Enter Username and get drawing</div>
                <input name="name" ref={(input) => { this.nameInput = input; }} type="text" maxLength="25" value={this.state.name} onChange={this._handleInputChange} onKeyPress={this._handleKeyPress} placeholder={"name"} />
                <button onClick={this.enter} disabled={!this.state.name}>Enter</button>
            </div>
        )
    }
}
export default Home;