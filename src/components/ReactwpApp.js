'use strict';

var React = require('react/addons');
//var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.css');
//获取图片信息
var imgData = require('../data/imagesData.json');
    imgData = (function getImgURL(imgArr){
        for(var i = 0,j = imgArr.length;i<j;i++){
            var singleImg = imgArr[i];
            singleImg.imgURL = require('../images/' + singleImg.fileName);
            imgArr[i] = singleImg;
        }
        return imgArr;
    })(imgData);
 function posArannge(low,high){
    return Math.ceil(Math.random() * (high - low) + low);
 }
var ImgFigure = React.createClass({
    render:function(){
        var styleObj = {};
        if(this.props.agData.pos){
            styleObj = this.props.agData.pos;
        }
        return (
            <div>
                <figure className="img-figure" style={styleObj}>
                    <img src={this.props.data.imgURL} alt={this.props.data.title}/>
                    <figcaption >
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
            right:0,

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
    rerrange:function(center){
        var imgPosArr = this.state.imgPosArr,
            Constant = this.Constant,
            centPos = Constant.centerPos,
            hPos = Constant.hPosA,
            hPosLx = hPos.leftX,
            hPosRx = hPos.rightX,
            hPosY = hPos.topY,
            vPos = Constant.vPosA,
            vPosX = vPos.x,
            vPosY = vPos.topY,
            imgTop = [],
            topNum = Math.ceil(Math.random() * 3),
            centerNum = Math.ceil(Math.random() * (imgPosArr.length -1)),
            topIndex = 0;
            var imgCenter = imgPosArr.splice(centerNum,1);
        imgCenter[0].pos = centPos;
            imgTop = imgPosArr.splice(centerNum - topNum,topNum);
          for(var i=0,j = imgPosArr.length,k = j/2;i<j;i++){
              var posOr=null;
              if(i<k){
                  posOr = hPosLx;
              }else{
                  posOr = hPosRx;
              }
              imgPosArr[i].pos = {
                  left:posArannge(posOr[0],posOr[1]),
                  top:posArannge(hPosY[0],hPosY[1])
              }
          };
           imgTop.forEach(function(value,index){
               imgTop[index].pos = {
                   top:posArannge(vPosY[0],vPosY[1]),
                   left:posArannge(vPosX[0],vPosX[1]),
                   background:"pink"
               }
           });
        function topSplice(i){
            imgPosArr.splice(centerNum - topNum,0,imgTop[i])
        };
        if(imgTop[1]){
            for(var i =1;i<topNum;i++){
                imgPosArr.splice(centerNum - topNum,0,imgTop[i])
            }
        }
        console.log(imgTop)
        imgPosArr.splice(centerNum - topNum,0,imgTop[0]);
        imgPosArr.splice(centerNum,0,imgCenter[0]);
        this.setState(
            {
                imgPosArr:imgPosArr
            }
        )
    }
    ,
    getInitialState:function(){
       return {
           imgPosArr:[
               {
                   pos:{
                       //left:0,
                       //right:0,
                       //top:0
                   }
               }
           ]
       }
    },
    componentDidMount:function(){
        var stage = React.findDOMNode(this.refs.stage),
            stageW = stage.scrollWidth,
            stageH = stage.scrollHeight,
            halfstageW = stageW / 2,
            halfstageH = stageH / 2,

            imgSize = React.findDOMNode(this.refs.imgFigure0).childNodes[0],
            imgW  = imgSize.clientWidth,
            halfimgW = imgW / 2 ,
            imgH = imgSize.clientHeight,
            halfimgH = imgH /2 ;
            this.Constant.centerPos = {
                left: halfstageW - halfimgW,
                top: stageH - imgH,
                background:"black",
                zIndex:9999
            };
            this.Constant.hPosA.leftX = [-halfimgW,halfstageW  - halfimgW * 2.5 ];
            this.Constant.hPosA.rightX = [halfstageW + halfimgW * 1.5,stageW - halfimgW];
            this.Constant.hPosA.topY = [-halfimgH,stageH  - halfimgW];

            this.Constant.vPosA.x = [halfstageW - halfimgW, halfstageW + imgW];
            this.Constant.vPosA.topY = [-halfimgH,stageH - imgH * 1.5];
            this.rerrange();
    },
    render:function(){
        var controller=[],imgFigures = [];
        imgData.forEach(function(value,index){
            if(!this.state.imgPosArr[index]){
                this.state.imgPosArr[index]={
                pos:{
                    left:0,
                    top:0
                }
                }
            }
            imgFigures.push(<ImgFigure data={value} agData={this.state.imgPosArr[index]} ref={"imgFigure" + index}/>)
        }.bind(this)
            )
         return (
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
