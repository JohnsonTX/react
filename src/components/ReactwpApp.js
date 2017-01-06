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
    return (Math.random() > 0.5 ? "" : "-") + Math.ceil((Math.random() * 30));
};
var ImgFigure = React.createClass({
    handleClick:function(e){
        this.props.inverseDa();
     e.stopPropagation();
     e.preventDefault();
    },
    render:function(){
        var styleObj = {};
        if(this.props.agData.pos){
            styleObj = this.props.agData.pos;
        }
       if(this.props.agData.rotate){
           (['-mos-',"-webkit-","-ms-",""]).forEach(function(value){
               styleObj[value + "transform"] = "rotate(" + this.props.agData.rotate + "deg)";
           }.bind(this))
       }
        var imgFigureCs = 'img-figure';
             imgFigureCs += this.props.agData.isInverse ?  " is-inverse" : "";
        return (
            <div>
                <figure className={imgFigureCs} style={styleObj} onClick={this.handleClick}>
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
    rerrange:function(){
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
            topNum = Math.ceil(Math.random() * 3),
            centNum = Math.ceil(Math.random() * imgArr.length - 1),
            topImg = [],
            imgCenter = imgArr.splice(centNum,1);
            imgCenter[0].pos = centPos;
        topImg = imgArr.splice(centNum - topNum,topNum);
            topImg.forEach(function(value,index){
                topImg[index] = {
                   pos:{
                       left:arrange(vPosx[0],vPosx[1]),
                       top:arrange(vPosY[0],vPosY[1]),
                       background:"pink"
                   },
                    rotate:Rotate(),
                }
            })
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
                   rotate:Rotate()
               }
           }
          imgArr.splice(centNum,0,imgCenter[0]);
           if(topImg[1]){
               for(var i =0;i<topNum;i++){
                   imgArr.splice(centNum - topNum,0,topImg[i]);
               }
           }else{
               imgArr.splice(centNum - topNum,0,topImg[0]);
           }
        this.setState({
            imgArr:imgArr
        })
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
        //
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
            background:"yellow"
        };
        this.Constant.hPosA.leftX = [-imgWh,halfStageW - imgWh * 2.5];
        this.Constant.hPosA.rightX = [halfStageW + imgWh * 1.5, stageW - imgW];
        this.Constant.hPosA.topY = [-imgHh, stageH - imgHh];
        this.Constant.vPosA.x = [halfStageW - imgW, halfStageW + imgW / 3];
        this.Constant.vPosA.topY = [ -imgH, -imgHh ];
        this.rerrange();
    },
    render:function(){
        var controllerUnits = [],imgFigures = [];
        imgDatas.forEach(function(value,index){
            if(!this.state.imgArr[index]){
                this.state.imgArr[index] = {
                    pos:{
                        left:0,
                        top:0
                    },
                    rotate:0,
                    isInverse:false
                }
            }
           imgFigures.push(<ImgFigure data ={value} ref={"imgFigure" + index} agData={this.state.imgArr[index]} inverseDa={this.inverse(index)}/>);
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
