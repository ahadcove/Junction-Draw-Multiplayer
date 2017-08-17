import React,{Component} from 'react';
import "../Styles/Canvas.css";
import io from 'socket.io-client';

// const socket = io();
// const socket = io.connect('http://localhost:9000');
const socket = io.connect( "http://localhost:8080");

class Draw extends Component{
    constructor(){
        super();
        this.state = {
            name:'',
            users:[],
            color: 'black',
            drawing:false,
            context:null,
            width:null, height:null,
            x:null,y:null, prevX:null, prevY:null
        }
    }

    componentWillMount(){
        console.log("Socket", socket.id);
        console.log(this.props.location);
        this.setState({name: this.props.location.state.name});
    }

    componentDidMount(){
        this.setUpCanvas();
        this.connection();
    }
    
    componentWillUnmount() {  
        socket.emit('leave room', {
          room: this.props.challenge.id
        })
    }

    
    
    setUpCanvas = () => {
        // let width = window.innerWidth;
        // let height = window.innerHeight;
        console.log("Parent size", this.canvasContain.offsetWidth, this.canvasContain.offsetHeight);
        let width = this.canvasContain.offsetWidth;
        let height = this.canvasContain.offsetHeight;
        this.setState({context:this.canvas.getContext('2d'), width, height})
        this.canvas.width = width;
        this.canvas.height = height;
    }

    connection = () => {
        console.log("id", socket);     
        socket.emit('connected', {name: this.state.name});        
        
        socket.on("get canvas", (canvas)=>{
            console.log("Canvas", canvas);
            for(let i = 0; i < canvas.length; i++){
                this.drawLine(this.state.context, canvas[i].x1, canvas[i].y1, canvas[i].x2, canvas[i].y2, canvas[i].color);
            }
        });

        socket.on('draw', (data) => {
            this.drawLine(this.state.context, data.x1, data.y1, data.x2, data.y2, data.color);
        });

        socket.on('erase board', (data) => {
            // this.setState({context:this.canvas.getContext('2d')});
            // this.state.context.clearRect(0, 0, this.state.width, this.state.height)
            this.state.context.clearRect(0, 0, this.state.width, this.state.height)
            
            // this.setState({context:this.state.context.clearRect(0, 0, this.state.width, this.state.height) });
        });

    }

    selectColor = (color) => {
        console.log("Changing color to", color);
        this.setState({color});
    }
    
    startDraw = (e) => {
        console.log("Started Drawing");
        this.setState({drawing:true, prevX:this.state.x, prevY:this.state.y});
    }

    drawing = (e) => {
        let rect = this.canvas.getBoundingClientRect();
        let x=e.clientX - rect.left;
        let y=e.clientY - rect.top;
        this.setState({ x, y});
        if(this.state.drawing){
            console.log("Drawing", x, y);
            this.drawLine(this.state.context, this.state.prevX, this.state.prevY, x, y, this.state.color);
            this.setState({prevX:x, prevY:y});
            socket.emit('draw', {
                'x1': this.state.prevX,
				'y1': this.state.prevY,
				'x2': x,
                'y2': y,
                color: this.state.color
            });
            
        }
    }

    endDraw = (e) => {
        console.log("Stopped Drawing");
        this.setState({drawing:false});
    }

    drawLine = (context, x1, y1, x2, y2, color) => {
        let newcontext = this.state.context;
        newcontext.strokeStyle=color;
        this.setState({context:newcontext},()=>{
            this.state.context.beginPath();        
            this.state.context.moveTo(x1, y1);
            this.state.context.lineTo(x2, y2);
            // this.state.context.strokeStyle=color;
            context.lineWidth = 2;        
            this.state.context.stroke();
            this.state.context.closePath();
        })
    }

    eraseBoard = () => {
        socket.emit('erase board');
        this.state.context.clearRect(0, 0, this.state.width, this.state.height);
        // this.setState({context:this.state.context.clearRect(0, 0, this.state.width, this.state.height) });
    }

    render(){
        return(
            <div className={"draw-container"}>
                {this.state.name}
                <button onClick={this.eraseBoard} >Clean Board</button>
                <div>
                    Colors:
                    <button onClick={()=>this.selectColor("red")}>Red</button>
                    <button onClick={()=>this.selectColor("blue")}>Blue</button>
                    <button onClick={()=>this.selectColor("green")}>Green</button>
                </div>
                <div className={"canvas-contain"} ref={(node)=>{this.canvasContain = node}}>
                    <canvas id={"canvas"} ref={(node)=>{this.canvas = node}} 
                        onMouseDown={this.startDraw} onMouseUp={this.endDraw} 
                        onMouseMove={this.drawing}
                    />
                </div>
            </div>
        )
    }
}
export default Draw;