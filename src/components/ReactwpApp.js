'use strict';

var React = require('react/addons');
//var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.css');
//获取图片信息
var imageDatas = require('../data/imagesData.json');
    imageDatas = (function getImgData(imgArr){
        for(var i = 0,j=imgArr.length;i<j;i++){
            var singleImgData = imgArr[i];
             singleImgData.imgURL = require('../images/' + singleImgData.fileName);
            imgArr[i] = singleImgData;
        }
        return imgArr;
    })(imageDatas);
function arranges(low,high){
    return Math.ceil(Math.random() * (high - low) + low)
};
var ImgFigure = React.createClass({
    render:function(){
        var styleObj = {};
        if(this.props.agData.pos){
            styleObj = this.props.agData.pos;
        }
        return(
            <div>
                <figure className="img-figure" style={styleObj}>
                    <img src={this.props.data.imgURL} alt={this.props.data.title}/>
                    <figcaption>
                        <h2 className="img-title">{this.props.data.title}</h2>
                    </figcaption>
                </figure>
            </div>
        )
    }
});

var ReactwpApp = React.createClass({
    Constant:{
        centerPos:{
            left:0,
            right:0
        },
        hPosRange:{
            leftX:[0,0],
            rightX:[0,0],
            y:[0,0]
        },
        vPosRange:{
            x:[0,0],
            topY:[0,0]
        }
    },
    arranged:function(center){
    var imgPosArr = this.state.imgPosArr,
        Constant = this.Constant,
        centerPs = Constant.centerPos,
        hPos = Constant.hPosRange,
        hPoslX = hPos.leftX,
        hPosRX = hPos.rightX,
        hPosY = hPos.y,

        vPos = Constant.vPosRange,
        vPosX = vPos.x,
        vPosTopy = vPos.topY,
        topImgNum = Math.ceil(Math.random() * 2),
        topIndex = 0,
        imgTopArr = [],
        centerImg = imgPosArr.splice(center,1);
    centerImg[0].pos=centerPs;
    topIndex = Math.ceil(imgPosArr.length - topImgNum);
    imgTopArr = imgPosArr.splice(topIndex,topImgNum);
    console.log(imgTopArr)
        imgPosArr.splice(topIndex,topImgNum);
    for(var i = 0,j = imgPosArr.length,k=j / 2; i<j;i++){
        var posOr = null;
        if(i<k){
            posOr = hPoslX;
        }else {
            posOr = hPosRX;
        }
        imgPosArr[i].pos = {
            left:arranges(posOr[0],posOr[1]),
            top:arranges(hPosY[0],hPosY[1]),
        }
    }
        imgTopArr.forEach(function(value,index){
            imgPosArr[index].pos ={
                top:arranges(vPosTopy[0],vPosTopy[1]),
                left:arranges(vPosX[0],vPosX[1]),
            }
        })
    if(imgPosArr && imgPosArr[0]){
        imgPosArr.splice(topIndex,0,imgPosArr[0])
    }
    imgPosArr.splice(center,0,centerImg[0]);
    this.setState({
            imgPosArr:imgPosArr
        }
    )
},
    getInitialState:function(){
        return {
            imgPosArr:[
                //{
                //pos:{
                //    left:0,
                //    top:0
                //}
                //}
            ]
        }

    },
    componentDidMount:function(){
        var stage = React.findDOMNode(this.refs.stage),
            stageW =  stage.scrollWidth,
            stageH = stage.scrollHeight,
            halfstgW = Math.ceil(stageW / 2),
            halfstgH = Math.ceil(stageH / 2),
            img = React.findDOMNode(this.refs.imgFg0).childNodes[0],
            imgW = img.clientWidth,
            imgH = img.clientHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);
        this.Constant.centerPos = {
            left:halfstgW - halfImgW,
            top: stageH - imgH
        };
        this.Constant.hPosRange.leftX = [-halfImgW,halfstgW - halfImgW*2];
        this.Constant.hPosRange.rightX = [halfstgW+halfImgW,stageW];
        this.Constant.hPosRange.y = [-halfImgH,halfstgW - halfImgH*2];
        this.Constant.vPosRange.x =[ halfstgW - halfImgW  , halfstgW + halfImgW ] ;
        this.Constant.vPosRange.topY = [-halfImgH / 2,0];
        this.arranged(0);
    },
   render:function(){
       var controllerUnits=[],imgFigures=[];

       imageDatas.forEach(function(value,index){
           if(!this.state.imgPosArr[index]){
               this.state.imgPosArr[index]={
                   pos: {
                       left:0,
                        top:0
                   }
               }
           }
           imgFigures.push(<ImgFigure data={value} ref={"imgFg" + index} agData={this.state.imgPosArr[index]}/>)
       }.bind(this));
       return(
           <div>
               <section className="stage" ref="stage">
                   <section className="img-sec">
                       {imgFigures}
                   </section>
                   <nav className="controller-nav">

                   </nav>
               </section>
           </div>
       )
   }
})
React.render(<ReactwpApp />, document.getElementById('content')); // jshint ignore:line
module.exports = ReactwpApp;
