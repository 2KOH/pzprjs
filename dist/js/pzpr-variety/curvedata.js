/*! @license pzpr.js vf48a2f47 (c) 2009-2022 sabo2, MIT license
 *   https://github.com/sabo2/pzprv3 */

!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["curvedata","curvedata-aux"],{"MouseEvent@curvedata":{inputModes:{edit:["copy-answer","move-clue","border","shade","undef","clear"],play:["line","peke"]},mouseinput_auto:function(){if(this.puzzle.playmode)"left"===this.btn?this.mousestart||this.mousemove?this.inputLine():this.mouseend&&this.notInputted()&&this.inputpeke():"right"===this.btn&&(this.mousestart||this.mousemove)&&this.inputpeke();else if(this.puzzle.editmode&&this.mousestart){var a=this.getcell();if(a.isnull)return;this.setcursor(a);var b=this.board.shapes[a.qnum],c=this.puzzle.board.cols,d=this.puzzle.board.rows;b&&b.w>0&&(c=Math.max(c,b.w),d=Math.max(d,b.bits.length/b.w));var e=[c,d];b&&b.w>0&&(e.push(b.w),e.push(b.bits.length/b.w),e.push(b.encodeBits()));var f=this,g={pid:"curvedata-aux",key:a.bx+","+a.by,url:e.join("/")};this.puzzle.emit("request-aux-editor",g,function(b){var c=b.board.getShape();(c||a.qnum>=0)&&f.addOperation(a,c)})}},addOperation:function(a,b){var c=new this.klass.CurveDataOperation(a,b);c.isvalid&&(c.redo(),this.puzzle.opemgr.add(c),a.draw())},inputShade:function(){return this.enterqnum(-3)},mouseinput_undef:function(){return this.enterqnum(-2)},mouseinput_clear:function(){return this.enterqnum(-1)},enterqnum:function(a){var b=this.getcell();!b.isnull&&b!==this.mouseCell&&this.puzzle.editmode&&(this.mouseCell=b,this.mousestart&&(this.inputData=b.qnum!==a?a:-1),-3===this.inputData&&["left","right","top","bottom"].forEach(function(a){b.adjborder[a].isnull||(b.adjborder[a].setQues(0),b.adjborder[a].removeLine())}),this.addOperation(b,this.inputData))},mouseinput_other:function(){"copy-answer"===this.inputMode&&this.mousestart&&this.mouseinput_copyAnswer(),"move-clue"===this.inputMode&&this.mouseinput_moveClue()},mouseinput_copyAnswer:function(){var a=this.getcell();if(!a.isnull&&this.puzzle.editmode&&a.path){var b=a.path.clist.toCurveData();this.addOperation(a,b)}},mouseinput_moveClue:function(){var a=this.getcell();if(this.mousestart)return void(this.mouseCell=-1!==a.qnum&&-3!==a.qnum?a:null);if(this.mouseCell&&!a.isnull&&!this.mouseCell.equals(a)&&-1===a.qnum){var b=this.board.shapes[this.mouseCell.qnum]||this.mouseCell.qnum;this.addOperation(a,b),this.addOperation(this.mouseCell,-1),this.mouseCell=a}}},"MouseEvent@curvedata-aux":{inputModes:{edit:[],play:["line","slide"]},mouseinput_auto:function(){this.inputLine()},mouseinput_other:function(){"slide"===this.inputMode&&this.mouseinput_slide()},mouseinput_slide:function(){var a=this.getcell();if(this.mousestart)return void(this.inputData=a.lcnt>0?a:null);this.inputData&&!a.isnull&&(this.inputData.bx<a.bx&&this.addSlideOperation("R",this.inputData)?this.inputData=this.inputData.adjacent.right:this.inputData.bx>a.bx&&this.addSlideOperation("L",this.inputData)?this.inputData=this.inputData.adjacent.left:this.inputData.by<a.by&&this.addSlideOperation("D",this.inputData)?this.inputData=this.inputData.adjacent.bottom:this.inputData.by>a.by&&this.addSlideOperation("U",this.inputData)&&(this.inputData=this.inputData.adjacent.top))},addSlideOperation:function(a,b){var c=new this.klass.SlideOperation(a,b);return!!c.isvalid()&&(c.redo(),this.puzzle.opemgr.add(c),!0)}},Border:{enableLineNG:!0,isLineNG:function(){return 1===this.ques||-3===this.sidecell[0].qnum||-3===this.sidecell[1].qnum},prehook:{ques:function(a){return a>0&&this.removeLine(),!1}}},Board:{hasborder:1,shapes:[],createExtraObject:function(){this.shapes=[]},compressShapes:function(){var a,b={};for(a=0;a<this.cell.length;a++)b[this.cell[a].qnum]=!0;b[-1]=-1,b[-2]=-2,b[-3]=-3;var c=0;for(a=0;a<this.shapes.length;a++)a in b&&(b[a]=c++);if(c!==a){for(a=0;a<this.cell.length;a++)this.cell[a].qnum=b[this.cell[a].qnum];for(a=0;a<this.shapes.length;a++)this.shapes[b[a]]=this.shapes[a];for(this.shapes=this.shapes.slice(0,c),a=0;a<this.linegraph.components.length;a++){var d=this.linegraph.components[a];d.isomorphicWith=null,this.linegraph.components.scanForClues(d)}}}},"Board@curvedata-aux":{setShape:function(a){for(var b=a.w,c=a.bits.length/b,d=this.cols-b|1,e=this.rows-c|1,f=0;f<c;f++)for(var g=0;g<b;g++){var h=this.getc(2*g+d,2*f+e);h&&!h.isnull&&(1&a.bits[f*b+g]&&!h.adjborder.right.isnull&&h.adjborder.right.setLine(1),2&a.bits[f*b+g]&&!h.adjborder.bottom.isnull&&h.adjborder.bottom.setLine(1))}},getShape:function(){var a=this.cell.filter(function(a){return a.lcnt>0});return a&&a.length>0&&new this.klass.CellList(a).toCurveData()}},CurveData:{bits:[],w:0,positions:null,connections:null,nodecnt:0,serialized:null,initialize:function(){this.w=0,this.bits=[],this.invalidate()},init:function(a,b){var c=a*b;this.w=a,this.bits=Array(c);for(var d=0;d<c;d++)this.bits[d]=0;this.invalidate()},invalidate:function(){this.positions=null,this.connections=null,this.nodecnt=0,this.serialized=null},buildBits:function(){for(var a=this.bits.length,b=this.w,c=0;c<a;c++){this.bits[c]&=3;var d=Math.floor(c%b),e=Math.floor(c/b);d>0&&1&this.bits[e*b+d-1]&&(this.bits[c]|=4),e>0&&2&this.bits[(e-1)*b+d]&&(this.bits[c]|=8)}},build:function(){var a=this.bits.length,b=this.w,c=a/this.w;this.positions={},this.connections={},this.nodecnt=0,this.buildBits();for(var d=0;d<a;d++){var e=this.bits[d];0!==e&&5!==e&&10!==e&&(this.connections[d]={left:[],right:[],top:[],bottom:[]},this.nodecnt++)}for(var f=0;f<c;f++)for(var g=null,h=0;h<b;h++){var d=f*b+h;if(null===g&&1&this.bits[d])g=[d];else if(null!==g&&5!==this.bits[d]&&(g.push(d),!(1&this.bits[d]))){var i=this.connections;g.forEach(function(a,b){i[a].left=g.slice(0,b),i[a].right=g.slice(b)}),g=null}}for(var h=0;h<b;h++)for(var g=null,f=0;f<c;f++){var d=f*b+h;if(null===g&&2&this.bits[d])g=[d];else if(null!==g&&10!==this.bits[d]&&(g.push(d),!(2&this.bits[d]))){var i=this.connections;g.forEach(function(a,b){i[a].top=g.slice(0,b),i[a].bottom=g.slice(b)}),g=null}}for(var d=0;d<a;d++){var j=this.bits[d];if(0!==j&&5!==j&&10!==j){var i=this.connections[d],k=this.bits,l=function(a){return k[a]},e=[j,"R",i.right.map(l).join(","),"B",i.bottom.map(l).join(","),"L",i.left.map(l).join(","),"T",i.top.map(l).join(",")].join("");e in this.positions?this.positions[e].push(d):this.positions[e]=[d]}}},deepEquals:function(a){return a&&this.w===a.w&&this.encodeBits()===a.encodeBits()},isIsomorphic:function(a){if(!a)return!1;if(this.positions||this.build(),a.positions||a.build(),this.nodecnt!==a.nodecnt)return!1;for(var b in this.positions)if(!(b in a.positions)||this.positions[b].length!==a.positions[b].length)return!1;var c=[],d={};for(var b in this.positions){var e=this.positions[b],f=a.positions[b],g=e.length;if(1!==g){for(var h=new Array(g),i=0;i<g;i++)h[i]=0,d[e[i]]=f[i];c.push({c:h,input:e,other:f,current:e.slice()})}else d[e[0]]=f[0]}for(;;){if(this.isConnectionsEqual(a,d))return!0;var j=0;for(j=0;j<c.length;j++){for(var k=c[j],l=this.permute_next(k),i=0;i<k.c.length;i++)d[k.current[i]]=k.other[i];if(l)break}if(j===c.length)return!1}},permute_next:function(a){for(var b=1;b<a.c.length;){if(a.c[b]<b){var c=b%2&&a.c[b],d=a.current[b];return a.current[b]=a.current[c],a.current[c]=d,a.c[b]++,!0}a.c[b++]=0}for(b=0;b<a.c.length;b++)a.current[b]=a.input[b],a.c[b]=0;return!1},isConnectionsEqual:function(a,b){for(var c in this.connections){var d=this.connections[c],e=a.connections[b[c]];if(d.right.length!==e.right.length)return!1;for(var f=0;f<d.right.length;f++)if(e.right[f]!==b[d.right[f]])return!1;if(d.bottom.length!==e.bottom.length)return!1;for(var f=0;f<d.bottom.length;f++)if(e.bottom[f]!==b[d.bottom[f]])return!1}return!0},encodeBits:function(){if(null!==this.serialized)return this.serialized;for(var a="",b=this.bits.length,c=0;c<b-1;c+=2){var d=3&this.bits[c];d|=(3&this.bits[c+1])<<2,a+=d.toString(16)}return this.serialized=a,a},decodeBits:function(a){for(var b=this.bits.length,c=0;c<b-1;c+=2){var d=parseInt(a[c/2],16);this.bits[c]=3&d,this.bits[c+1]=(12&d)>>2}this.invalidate()}},"CurveDataOperation:Operation":{type:"curvedata",setData:function(a,b){var c=a.board.shapes[a.qnum];if(c?(this.oldw=c.w,this.oldh=c.bits.length/c.w,this.oldbits=c.encodeBits()):this.oldqnum=a.qnum,b&&"object"==typeof b)b.bits.length>0?(this.neww=b.w,this.newh=b.bits.length/b.w,this.newbits=b.encodeBits()):this.newqnum=-1;else if("number"==typeof b&&b<0)this.newqnum=b;else{if(b||0===b)throw Error("Can only set shapes or negative qnum values");this.newqnum=-1}this.x=a.bx,this.y=a.by,this.isvalid=this.oldw!==this.neww||this.oldh!==this.newh||this.oldbits!==this.newbits||this.oldqnum!==this.newqnum},decode:function(a){var b=0;return"DC"===a[b++]&&(this.x=+a[b++],this.y=+a[b++],this.neww=+a[b++],this.newh=+a[b++],this.newbits=a[b++],this.newqnum=+a[b++],this.oldw=+a[b++],this.oldh=+a[b++],this.oldbits=a[b++],this.oldqnum=+a[b++],!0)},toString:function(){return["DC",this.x,this.y,this.neww,this.newh,this.newbits,this.newqnum,this.oldw,this.oldh,this.oldbits,this.oldqnum].join(",")},undo:function(){this.oldqnum?this.execNum(this.oldqnum):this.execShape(this.oldw,this.oldh,this.oldbits)},redo:function(){this.newqnum?this.execNum(this.newqnum):this.execShape(this.neww,this.newh,this.newbits)},execShape:function(a,b,c){var d=new this.klass.CurveData;d.init(a,b),d.decodeBits(c);for(var e=this.board.shapes.length,f=0;f<e;f++)if(this.board.shapes[f].deepEquals(d))return this.execNum(f);return this.board.shapes.push(d),this.execNum(e)},execNum:function(a){var b=this.board.getc(this.x,this.y);b.qnum=a,b.path&&this.board.linegraph.scanForClues(b.path),b.draw()}},"SlideOperation:Operation":{setData:function(a,b){this.dir=a,this.x=b.bx,this.y=b.by},toString:function(){return["DS",this.dir,this.x,this.y].join(",")},decode:function(a){return"DS"===a[0]&&(this.dir=a[1],this.x=+a[2],this.y=+a[3],!0)},slide:function(a,b,c){var d=this.board.getc(b,c).path,e={R:2,L:-2}[a]||0,f={D:2,U:-2}[a]||0,g=new Set;d.nodes.forEach(function(a){for(var b in a.obj.adjborder){var c=a.obj.adjborder[b];!c.isnull&&c.line&&g.add(c.id)}});var h=Array.from(g),i="R"===a||"D"===a?function(a,b){return b-a}:function(a,b){return a-b};h.sort(i);for(var j in h){var k=this.board.border[h[j]],l=this.board.getb(k.bx+e,k.by+f);k.line=0,l.line=1,this.board.modifyInfo(k,"border.line"),k.draw(),this.board.modifyInfo(l,"border.line"),l.draw()}},undo:function(){switch(this.dir){case"L":return this.slide("R",this.x-2,this.y);case"R":return this.slide("L",this.x+2,this.y);case"U":return this.slide("D",this.x,this.y-2);case"D":return this.slide("U",this.x,this.y+2)}},redo:function(){return this.slide(this.dir,this.x,this.y)},isvalid:function(){var a=this.board.getc(this.x,this.y).path;if(!a)return!1;for(var b={U:"top",D:"bottom",L:"left",R:"right"}[this.dir],c=0;c<a.clist.length;c++){var d=a.clist[c].adjacent[b];if(!d||d.isnull||d.path&&d.path!==a)return!1}return!0}},OperationManager:{addExtraOperation:function(){this.operationlist.push(this.klass.CurveDataOperation),this.operationlist.push(this.klass.SlideOperation)}},Cell:{minnum:0,maxnum:function(){return this.board.shapes.length-1},getBits:function(){var a=0,b={right:1,bottom:2,left:4,top:8};for(var c in b)this.adjborder[c].isLine()&&(a|=b[c]);return a}},CellList:{toCurveData:function(){var a=this.getRectSize(),b=new this.klass.CurveData;b.init(a.cols,a.rows);for(var c=0;c<this.length;c++){var d=this[c],e=(d.by-a.y1)/2*a.cols+(d.bx-a.x1)/2;d.adjborder.right.isLine()&&(b.bits[e]|=1),d.adjborder.bottom.isLine()&&(b.bits[e]|=2)}return b}},LineGraph:{enabled:!0,makeClist:!0,invalidateClue:function(a){for(var b=0;b<this.components.length;b++){var c=this.components[b];c.isomorphicWith===a&&(c.isomorphicWith=null)}},scanForClues:function(a){a.cluecnt=0,a.clueid=null;for(var b=0;b<a.nodes.length;b++){var c=a.nodes[b].obj;if(-1!==c.qnum){if(0!==a.cluecnt)return a.cluecnt=2,void(a.clueid=null);a.cluecnt=1,a.clueid=c.qnum}}},setExtraData:function(a){this.common.setExtraData.call(this,a),a.isomorphicWith=null,a.shape=null,this.scanForClues(a)}},"Graphic@curvedata":{irowake:!0,gridcolor_type:"LIGHT",paint:function(){this.drawBGCells(),this.drawDashedGrid(),this.drawPekes(),this.drawLines(),this.drawCellShapes(),this.drawHatenas(),this.drawBorders(),this.drawChassis(),this.drawTarget()},drawCellShapes:function(){for(var a=this.vinc("cell_shape","auto"),b=this.range.cells,c=0;c<b.length;c++){var d=b[c];if(d.qnum>=0){var e=this.board.shapes[d.qnum];if(!e||!e.bits.length)continue;var f=e.w,g=e.bits.length/f,h=1.3*Math.min(this.bw/(f-1),this.bh/(g-1)),i=Math.min(this.lw/2,h/4),j=i/2;a.lineWidth=i;var k=d.bx*this.bw-h*(f-1)/2,l=d.by*this.bh-h*(g-1)/2;a.strokeStyle="black",a.vid="c_shape_"+d.id,a.beginPath();for(var m=0;m<g;m++)for(var n=0;n<f-1;n++)1&e.bits[m*f+n]&&(a.moveTo(k+n*h-j,l+m*h),a.lineTo(k+(n+1)*h+j,l+m*h));for(var m=0;m<g-1;m++)for(var n=0;n<f;n++)2&e.bits[m*f+n]&&(a.moveTo(k+n*h,l+m*h-j),a.lineTo(k+n*h,l+(m+1)*h+j));a.closePath(),a.stroke()}else a.vid="c_shape_"+d.id,a.vhide()}},getBorderColor:function(a){return 1===a.ques||-3===a.sidecell[0].qnum||-3===a.sidecell[1].qnum?this.quescolor:null},getBGCellColor:function(a){return-3===a.qnum?this.quescolor:a.error?this.errbcolor1:null}},"Graphic@curvedata-aux":{gridcolor_type:"LIGHT",linecolor:"black",paint:function(){this.drawBGCells(),this.drawDashedGrid(),this.drawLines(),this.drawChassis()}},BoardExec:{adjustBoardData:function(a,b){if(a&this.TURNFLIP){for(var c=this.getTranslateBits(a),d=this.board.shapes.length,e=0;e<d;e++){var f=this.board.shapes[e],g=f.w,h=f.bits.length,i=h/g;f.buildBits();for(var j=Array(h),k=0;k<h;k++){var l=f.bits[k];l in c&&(l=c[l]),j[this.getTranslatePosition(a,g,i,k)]=l}if(a&this.TURN){f.w=i;for(var m=0;m<i;m++)for(var n=0;n<g;n++)f.bits[n*i+m]=j[m*g+n]}else f.bits=j;f.invalidate()}a===this.TURNR?this.adjustBoardData(this.FLIPX,b):a===this.TURNL&&this.adjustBoardData(this.FLIPY,b)}},getTranslatePosition:function(a,b,c,d){var e=Math.floor(d%b),f=Math.floor(d/b);switch(a){case this.FLIPY:return(c-(f+1))*b+e;case this.FLIPX:return f*b+(b-(e+1));default:return d}},getTranslateBits:function(a){var b={};switch(a){case this.FLIPY:b={2:8,3:9,6:12,7:13,8:2,9:3,12:6,13:7};break;case this.FLIPX:b={1:4,3:6,9:12,11:14,4:1,6:3,12:9,14:11};break;case this.TURNR:case this.TURNL:b={1:2,2:1,4:8,5:10,6:9,7:11,8:4,9:6,10:5,11:7,13:14,14:13}}return b}},"Encode@curvedata":{decodePzpr:function(a){this.decodeClues();var b=this.outbstr.substr(1).split("/"),c=0;b[c]&&"b"===b[c][0]&&(this.outbstr=b[c++].substr(1),this.decodeBorder());var d=Math.floor(b.length/3);this.board.shapes=Array(d);for(var e=0;e<d;e++){var f=new this.klass.CurveData,g=+b[c++],h=+b[c++],i=b[c++];if(!g||!h)break;f.init(g,h),f.decodeBits(i),this.board.shapes[e]=f}},decodeClues:function(){var a=0,b=0,c=this.outbstr,d=this.board;for(b=0;b<c.length;b++){var e=d.cell[a],f=c.charAt(b);if(this.include(f,"0","9")||this.include(f,"a","f")?e.qnum=parseInt(f,16):"-"===f?(e.qnum=parseInt(c.substr(b+1,2),16),b+=2):"+"===f?(e.qnum=parseInt(c.substr(b+1,3),16),b+=3):"."===f?e.qnum=-2:"="===f?e.qnum=-3:f>="g"&&f<="z"&&(a+=parseInt(f,36)-16),a++,!d.cell[a])break}this.outbstr=c.substr(b+1)},encodePzpr:function(a){this.board.compressShapes();var b=this.board.shapes.length;this.encodeClues(),this.board.border.some(function(a){return 1===a.ques})&&(this.outbstr+="b",this.encodeBorder(),this.outbstr+="/");for(var c=[],d=0;d<b;d++){var e=this.board.shapes[d],f=e.w,g=e.bits.length,h=g/f;c.push(f),c.push(h),c.push(e.encodeBits())}this.outbstr+=c.join("/")},encodeClues:function(){for(var a=0,b="",c=this.board,d=0;d<c.cell.length;d++){var e="",f=c.cell[d].qnum;-2===f?e=".":-3===f?e="=":f>=0&&f<16?e=f.toString(16):f>=16&&f<256?e="-"+f.toString(16):f>=256&&f<4096?e="+"+f.toString(16):a++,0===a?b+=e:(e||20===a)&&(b+=(15+a).toString(36)+e,a=0)}a>0&&(b+=(15+a).toString(36)),this.outbstr+=b+"/"}},"Encode@curvedata-aux":{decodePzpr:function(a){var b=this.outbstr.split("/"),c=new this.klass.CurveData;c.init(+b[0],+b[1]),c.decodeBits(b[2]),this.board.setShape(c)},encodePzpr:function(a){var b=this.board.getShape(),c=[];c.push(b.w),c.push(b.w?b.bits.length/b.w:0),c.push(b.encodeBits()),this.outbstr+=c.join("/")}},"FileIO@curvedata":{decodeData:function(){var a=+this.readLine();this.decodeCell(function(a,b){"."!==b&&(a.qnum=+b)}),this.board.shapes=Array(a);for(var b=0;b<a;b++){var c=new this.klass.CurveData,d=+this.readLine(),e=+this.readLine();if(c.init(d,e),d>1)for(var f=this.getItemList(e),g=0;g<f.length;g++)if("1"===f[g]){var h=Math.floor(g%(d-1)),i=Math.floor(g/(d-1));c.bits[i*d+h]|=1}if(e>1)for(var j=this.getItemList(e-1),g=0;g<j.length;g++)"1"===j[g]&&(c.bits[g]|=2);this.board.shapes[b]=c}this.decodeBorder(function(a,b){"-2"===b?a.ques=1:"-1"===b?a.qsub=2:+b>0&&(a.line=+b)})},encodeData:function(){this.board.compressShapes();var a=this.board.shapes.length;this.writeLine(a),this.encodeCell(function(a){return-1===a.qnum?". ":a.qnum+" "});for(var b=0;b<a;b++){var c=this.board.shapes[b],d=c.w,e=c.bits.length,f=e/d;if(this.writeLine(d),this.writeLine(f),d>1)for(var g=0;g<f;g++){for(var h="",i=0;i<d-1;i++)h+=1&c.bits[g*d+i]?"1 ":"0 ";this.writeLine(h)}for(var g=0;g<f-1;g++){for(var h="",i=0;i<d;i++)h+=2&c.bits[g*d+i]?"1 ":"0 ";this.writeLine(h)}}this.encodeBorder(function(a){return 1===a.ques?"-2 ":a.line>0?a.line+" ":2===a.qsub?"-1 ":"0 "})}},"FileIO@curvedata-aux":{decodeData:function(){var a=new this.klass.CurveData,b=+this.readLine(),c=+this.readLine();a.init(b,c),a.decodeBits(this.readLine()),this.board.setShape(a)},encodeData:function(){var a=this.board.getShape();this.writeLine(a.w||0),this.writeLine(a.w?a.bits.length/a.w:0),a.w&&this.writeLine(a.encodeBits())}},"AnsCheck@curvedata":{checklist:["checkMultipleClues","checkShapes","checkNoClues","checkNoLine++"],checkNoClues:function(){return this.curvedata_shapecount(0,"shNone")},checkMultipleClues:function(){return this.curvedata_shapecount(2,"shMultiple")},checkNoLine:function(){this.checkAllCell(function(a){return-3!==a.qnum&&0===a.lcnt},"ceNoLine")},curvedata_shapecount:function(a,b){for(var c=this.board.linegraph.components,d=!1,e=0;e<c.length;e++){var f=c[e];if(f.cluecnt===a){if(this.failcode.add(b),this.checkOnly)return;d||(this.board.border.setnoerr(),d=!0),f.setedgeerr(1)}}},checkShapes:function(){for(var a=this.board.linegraph.components,b=!1,c=0;c<a.length;c++){var d=a[c];if(null!==d.clueid&&-2!==d.clueid&&!this.shapeMatches(d)){if(this.failcode.add("shIncorrect"),this.checkOnly)return;b||(this.board.border.setnoerr(),b=!0),d.setedgeerr(1)}}},shapeMatches:function(a){a.shape||(a.shape=a.clist.toCurveData());var b=a.shape;if(a.isomorphicWith===a.clueid)return!0;var c=this.board.shapes[a.clueid];return!!b.isIsomorphic(c)&&(a.isomorphicWith=a.clueid,!0)}},FailCode:{shNone:["記号マスを通っていない線があります。","A shape is not connected to a clue."],shMultiple:["2つ以上の記号マスを通る線があります。","A shape is connected to multiple clues."],shIncorrect:["記号の形に合っていない線があります。","A shape does not match the clue."]}});
//# sourceMappingURL=curvedata.js.map