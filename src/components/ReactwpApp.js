'use strict';

var React = require('react/addons');
//var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.css');
//获取图片信息
var imgDatas = require('../data/imagesData.json');
   imgDatas = (function(imgArr){
       for(var i =0,j = imgArr.length;i<j; i ++){
           var singleImg = imgArr[i];
           singleImg.imgURL = require('../images/' + singleImg.fileName);
           imgArr[i] = singleImg;
       }
       return imgArr;
   })(imgDatas);
function arrange(low,high){
     return Math.ceil(Math.random() * (high - low) + low);
};
function Rotate(){
  return (Math.random() > 0.5 ? "" : "-") + Math.ceil(Math.random() * 30);
};
var ControllerUnits = React.createClass({
    handleClick:function(e){
        if(this.props.agData.isCenter){
            this.props.inverse();
        }else{
            this.props.Center();
        }
        e.preventDefault();
        e.stopPropagation();
    },
    render:function(){
        var contCs = "controller-units";
           if(this.props.agData.isCenter){
               contCs += " is-center";
               if(this.props.agData.isInverse){
                   contCs += " is-inverse";
               }
           }
        return(

                <span className={contCs} onClick={this.handleClick}></span>
        )
    }
})
var ImgFigure = React.createClass({
    handleClick:function(e){
        if(this.props.agData.isCenter){
            this.props.inverse();
        }else{
            this.props.Center();
        }

        e.stopPropagation();
        e.preventDefault();
    },
    render:function(){
        var styleObj = {};
        if(this.props.agData.pos){
            styleObj = this.props.agData.pos;
        }
        if(this.props.agData.rotate){
            (['msTransform',"MozTransform","WebkitTransform","transform"]).forEach(function(value){
                styleObj[value + ""] = "rotate(" + this.props.agData.rotate + "deg)";
            }.bind(this))
        }
        var imgFgCs = "img-figure";
            imgFgCs += this.props.agData.isInverse ? " is-inverse" : "";


        return (
            <div>
                <figure className={imgFgCs} style={styleObj}  onClick={this.handleClick}>
                    <img src={this.props.data.imgURL} alt={this.props.data.fileName}/>
                    <figcaption>
                        <h2 className="img-title">
                            {this.props.data.title}
                        </h2>
                        <div className="img-back" onclick={this.handleClick}>
                            {this.props.data.desc}
                        </div>
                    </figcaption>
                </figure>
            </div>
        )
    }
})

var ReactwpApp = React.createClass({
    Constant:{
        centerPos:{
            left:0,
            right:0
        },
        hPosA:{
            leftX:[0,0],
            rightX:[0,0],
            topY:[0,0]
        },
        vPosA:{
            x:[0,0],
            topY:[0,0]
        }
    },
    inverse:function(index){
        return function(){
            var imgArr = this.state.imgArr;
               imgArr[index].isInverse = !imgArr[index].isInverse;
            this.setState({
                imgArr:imgArr
            })
        }.bind(this)
    },
    Center:function(index){
        return function(){
            this.rerrange(index)
        }.bind(this)
    },
    rerrange:function(center){
        var imgArr = this.state.imgArr,
            Constant = this.Constant,
            centPos = Constant.centerPos,
            hPos = Constant.hPosA,
            hPosLx = hPos.leftX,
            hPosRx = hPos.rightX,
            hPosY = hPos.topY,
            vPos = Constant.vPosA,
            vPosx = vPos.x,
            vPosY = vPos.topY,
            allNum = Math.ceil(Math.random() * imgArr.length ),
            centNum = Math.abs(allNum - center) - 0;
            for(var i = 0,j = imgArr.length, k = j /2;i<j;i++){
                var posOr = null;
                if(i<k){
                    posOr = hPosLx;
                }else{
                    posOr = hPosRx
                }
                imgArr[i] = {
                    pos:{
                        left:arrange(posOr[0],posOr[1]),
                        top:arrange(hPosY[0],hPosY[1])
                    },
                    rotate:Rotate(),
                    isCenter:false,
                }
            }
            var topNum =Math.ceil(Math.random() * 2), topImg=[]
            topImg = imgArr.splice(centNum,topNum);
            topImg.forEach(function(value,index){
                topImg[index] = {
                    pos:{
                        left:arrange(vPosx[0],vPosx[1]),
                        top:arrange(vPosY[0],vPosY[1]),
                        //background:"pink"
                    },
                    rotate:Rotate(),
                    isCenter:false,
                }
            });
            if(topNum == 2){
                imgArr.splice(centNum,0,topImg[0],topImg[1])
            }else{
                imgArr.splice(centNum,0,topImg[0])
            }
            var imgCenter = imgArr.splice(center,1);
            imgCenter[0] = {
                pos:centPos,
                isCenter:true,
                rotate:0
            };
            imgArr.splice(center,0,imgCenter[0]);
            this.setState({
                imgArr:imgArr
            })
           debugger;
    },
    getInitialState:function(){
        return {
            imgArr:[
        //        {
        //            pos:{
        //          left:0,
        //            right:0,
        //            top:0
        //        },
        //         rotate:0,
        //         isInverse:false,
        //         isCenter:false,
        //}
            ]
    }

    },
    componentDidMount:function(){
      var stage = React.findDOMNode(this.refs.stage),
          stageW = stage.scrollWidth,
          stageH = stage.scrollHeight,
          halfStageW = stageW / 2 ,
          halfStageH = stageH / 2,

          imgSize = React.findDOMNode(this.refs.imgFigure0).childNodes[0],
           imgW = imgSize.scrollWidth,
           imgWh = imgW / 2,
          imgH = imgSize.scrollHeight,
          imgHh = imgH / 2;

        this.Constant.centerPos = {
            left:halfStageW - imgWh,
            top:halfStageH - imgHh,
            zIndex:9999,
            color:"red",
            //background:"yellow"
        };
        this.Constant.hPosA.leftX = [-imgWh,halfStageW - imgWh * 2.5];
        this.Constant.hPosA.rightX = [halfStageW + imgWh * 1.5, stageW - imgWh];
        this.Constant.hPosA.topY = [-imgHh, stageH - imgHh];
        this.Constant.vPosA.x = [halfStageW - imgW, halfStageW + imgW / 3];
        this.Constant.vPosA.topY = [ -imgH, -imgHh ];
        var centImg = Math.abs(Math.ceil(Math.random() * this.state.imgArr.length -1));

        this.rerrange(centImg);
    },
    render:function(){
        var controllerUnits = [],imgFigures = [],
            stageH ={height:window.innerHeight};
        imgDatas.forEach(function(value,index){
            if(!this.state.imgArr[index]){
                this.state.imgArr[index] = {
                    pos:{
                        left:0,
                        top:0
                    },
                    rotate:0,
                    isInverse:false,
                    isCenter:false,
                }
            }
           imgFigures.push(<ImgFigure data ={value} numb={index} ref={"imgFigure" + index} agData={this.state.imgArr[index]} inverse={this.inverse(index)} Center={this.Center(index)} />);
           controllerUnits.push(< ControllerUnits agData={this.state.imgArr[index]} inverse ={this.inverse(index)} Center={this.Center(index)}/>)
        }.bind(this));
        return(
            <div>
                <section className="stage" ref="stage" style={stageH}>
                    <section className="img-sec">
                        {imgFigures}
                    </section>
                    <nav className="controller-nav">
                        {controllerUnits}
                    </nav>
                </section>
            </div>
        )
    }

    })
React.render(<ReactwpApp />, document.getElementById('content')); // jshint ignore:line
module.exports = ReactwpApp;
