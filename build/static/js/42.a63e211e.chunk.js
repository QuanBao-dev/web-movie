(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[42],{138:function(t,e,i){"use strict";i.d(e,"a",(function(){return a}));var a=function(){var t,e=!1;return t=navigator.userAgent||navigator.vendor||window.opera,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4)))&&(e=!0),e}},146:function(t,e,i){},151:function(t,e,i){"use strict";i.r(e);i(146);var a=i(7),n=i(119),r=i(0),o=i.n(r),c=i(154),s=i(107),m=i(139),u=i(168),d=i(150),l=i(138),w=[{maxWidth:1e5,minWidth:1e3,quantityItemPerRow:5},{maxWidth:1e3,minWidth:600,quantityItemPerRow:4},{maxWidth:600,minWidth:500,quantityItemPerRow:3},{maxWidth:500,minWidth:0,quantityItemPerRow:2}],p=Object(a.a)((function(){return Promise.all([i.e(0),i.e(14)]).then(i.bind(null,164))}));function h(t,e){for(var i=Object(m.a)(t,e.heightItem),a=i.rowStart,n=i.rowEnd,r=0;r<w.length;r++){var o=w[r],c=o.maxWidth,s=o.minWidth,u=o.quantityItemPerRow;if(window.innerWidth<c&&window.innerWidth>s){m.c.updateData({quantityItemPerRow:u});break}}a!==e.rowStart&&n!==e.rowEnd&&m.c.updateData({rowStart:a,rowEnd:n}),m.c.updateData({trigger:!m.c.currentState().trigger})}e.default=function(t){var e=t.data,i=t.error,a=t.isWrap,w=void 0===a||a,b=t.lazy,f=void 0!==b&&b,g=t.empty,v=void 0!==g&&g,y=t.virtual,k=void 0!==y&&y,I=t.isAllowDelete,x=void 0!==I&&I,j=t.searchBy,q=t.type,E=Object(r.useRef)(),O=m.c.currentState();return Object(r.useEffect)((function(){var t=Object(c.a)((function(){return Object(l.a)()}),Object(s.a)(window,"scroll").pipe(Object(u.a)((function(){return k}))),Object(s.a)(window,"scroll").pipe(Object(u.a)((function(){return k})),Object(d.a)(50))).subscribe((function(){var t=Object(m.a)(E,O.heightItem),e=t.rowStart,i=t.rowEnd;e!==O.rowStart&&i!==O.rowEnd&&m.c.updateData({rowStart:e,rowEnd:i})}));return function(){t.unsubscribe()}}),[O.heightItem,O.rowEnd,O.rowStart,k]),Object(r.useEffect)((function(){h(E,O);var t=Object(s.a)(window,"resize").pipe(Object(d.a)(500)).subscribe((function(){h(E,O)}));return function(){t.unsubscribe()}}),[O.heightItem,O.rowEnd,O.rowStart]),Object(r.useEffect)((function(){if(k){var t=E.current.offsetWidth/O.quantityItemPerRow,e=340*t/224,i=Math.ceil(O.genreDetailData.length/O.quantityItemPerRow)*e,a=Object(m.a)(E,e),n=a.rowStart,r=a.rowEnd;m.c.updateData({width:E.current.offsetWidth,height:i,widthItem:t,heightItem:e,rowStart:n,rowEnd:r})}}),[O.heightItem,O.quantityItemPerRow,O.genreDetailData.length,O.trigger,k]),o.a.createElement("div",{ref:E,className:w?"list-anime":"list-anime-nowrap",style:{position:k?"relative":"static",height:O.height,width:O.widthContainerList?O.widthContainerList:280}},e&&!k&&!i&&e.map((function(t,e){return o.a.createElement(p,{key:e,anime:t,lazy:f,searchBy:j,virtual:!1,isAllowDelete:x,type:q})})),e&&k&&!i&&e.slice((O.rowStart-1)*O.quantityItemPerRow,(O.rowEnd-1)*O.quantityItemPerRow).map((function(t,e){return o.a.createElement("div",{key:(O.rowStart-1)*O.quantityItemPerRow+e,style:k?{display:"flex",alignItems:"center",justifyContent:"center",height:O.heightItem,width:O.widthItem,position:"absolute",top:parseInt(((O.rowStart-1)*O.quantityItemPerRow+e)/O.quantityItemPerRow)*O.heightItem,left:parseInt(((O.rowStart-1)*O.quantityItemPerRow+e)%O.quantityItemPerRow)*O.widthItem}:{}},o.a.createElement(p,{type:q,anime:t,lazy:f,virtual:!0,isAllowDelete:x,styleAnimeItem:{width:"90%",height:"95%"},searchBy:j}))})),e&&0===e.length&&v&&o.a.createElement("div",{className:"empty"},o.a.createElement(n.a,{color:"secondary",size:"4rem"})),i&&o.a.createElement("div",{style:{margin:"100px auto 0 auto",color:"white",fontSize:"150%"}},"Anime is being updated..."))}},168:function(t,e,i){"use strict";i.d(e,"a",(function(){return r}));var a=i(2),n=i(5);function r(t,e){return void 0===e&&(e=!1),function(i){return i.lift(new o(t,e))}}var o=function(){function t(t,e){this.predicate=t,this.inclusive=e}return t.prototype.call=function(t,e){return e.subscribe(new c(t,this.predicate,this.inclusive))},t}(),c=function(t){function e(e,i,a){var n=t.call(this,e)||this;return n.predicate=i,n.inclusive=a,n.index=0,n}return a.a(e,t),e.prototype._next=function(t){var e,i=this.destination;try{e=this.predicate(t,this.index++)}catch(a){return void i.error(a)}this.nextOrComplete(t,e)},e.prototype.nextOrComplete=function(t,e){var i=this.destination;Boolean(e)?i.next(t):(this.inclusive&&i.next(t),i.complete())},e}(n.a)}}]);
//# sourceMappingURL=42.a63e211e.chunk.js.map