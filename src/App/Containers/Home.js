import React,{Component} from 'react';
import '../Styles/s_home.css';

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
            <div className={'home-contain'}>
                <div className={'login-box'}>
                    <div className={'login-header'}>
                        <div className={'title'}>Junction Draw</div>
                        <div className={"sub-title"}>Enter Username and get drawing</div>
                    </div>
                    <div className={'input-contain'}>
                        <input className={"name"} name="name" autoFocus ref={(input) => { this.nameInput = input; }} type="text" maxLength="15" value={this.state.name} onChange={this._handleInputChange} onKeyPress={this._handleKeyPress} placeholder={"name"} />
                        <button className={"submit"} onClick={this.enter} style={{color:(!this.state.name && "gray")}} disabled={!this.state.name}>Enter</button>
                    </div>
                </div>
            </div>
        )
    }
}
export default Home;