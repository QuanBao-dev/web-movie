(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[41],{138:function(t,e,n){"use strict";n.d(e,"a",(function(){return r}));var r=function(){var t,e=!1;return t=navigator.userAgent||navigator.vendor||window.opera,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4)))&&(e=!0),e}},270:function(t,e,n){},271:function(t,e,n){},347:function(t,e,n){"use strict";n.r(e);var r=n(26),c=n(0),a=n.n(c),i=(n(270),n(127)),s=n(107),o=n(178),u=n(142),l=n(149),f=n(150),m=n(168),b=n(2),p=n(145),d=n(147);var h=function(){function t(t,e){this.observables=t,this.project=e}return t.prototype.call=function(t,e){return e.subscribe(new g(t,this.observables,this.project))},t}(),g=function(t){function e(e,n,r){var c=t.call(this,e)||this;c.observables=n,c.project=r,c.toRespond=[];var a=n.length;c.values=new Array(a);for(var i=0;i<a;i++)c.toRespond.push(i);for(i=0;i<a;i++){var s=n[i];c.add(Object(d.a)(c,s,void 0,i))}return c}return b.a(e,t),e.prototype.notifyNext=function(t,e,n){this.values[n]=e;var r=this.toRespond;if(r.length>0){var c=r.indexOf(n);-1!==c&&r.splice(c,1)}},e.prototype.notifyComplete=function(){},e.prototype._next=function(t){if(0===this.toRespond.length){var e=[t].concat(this.values);this.project?this._tryProject(e):this.destination.next(e)}},e.prototype._tryProject=function(t){var e;try{e=this.project.apply(this,t)}catch(n){return void this.destination.error(n)}this.destination.next(e)},e}(p.a),v=n(140),j=n(138),y=function(t,e,n,r,c,a){r.current&&clearTimeout(r.current),t.current&&(t.current.style.transition=n?"0.5s":"0s",c(e),a&&a(e))},O=function(t,e,n,r,a,i,o,u,m,b,p,d,h){Object(c.useEffect)((function(){var c=t.current.offsetWidth/e;n(c),y(t,o,!1,u,m,b),r(Object(j.a)()),a&&a.forEach((function(t){var e=t.minWidth,n=t.maxWidth,r=t.amount;window.screen.availWidth>e&&window.screen.availWidth<=n&&i(r)}));var p=Object(s.a)(window,"resize").pipe(Object(l.a)((function(){t.current.style.transition="0s";var r=t.current.offsetWidth/e;n(r),a&&a.forEach((function(t){var e=t.minWidth,n=t.maxWidth,r=t.amount;window.screen.availWidth>e&&window.screen.availWidth<=n&&i(r)})),d(!1)})),Object(f.a)(1e3)).subscribe((function(){r(Object(j.a)()),!0===h.current&&d(!0)}));return function(){p.unsubscribe()}}),[p,e])},w=function(t,e,n,r,a,i,s,f,b,p){Object(c.useEffect)((function(){var c=Object(o.a)(1e3*t).pipe(Object(m.a)((function(){return e})),function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return function(e){var n;"function"===typeof t[t.length-1]&&(n=t.pop());var r=t;return e.lift(new h(r,n))}}(Object(u.a)(500).pipe(Object(l.a)((function(){Math.abs(n-p)===s&&y(i,n,!1,f,r,b)}))))).subscribe((function(){!function(t,e,n,r,c,a,i){var s=n+e,o=s+n-1;t<o&&y(c,t+1,!0,r,a,i);t+1>o&&(y(c,t+1,!0,r,a,i),r.current=setTimeout((function(){r.current&&(y(c,s,!1,r,a,i),r.current=null)}),500))}(n,a,s,f,i,r,b)}));return function(){c.unsubscribe()}}),[e,p,n,a,t])},x=function(t,e,n,r,a,i){Object(c.useEffect)((function(){var c=Object(s.a)(t.current,n?"touchstart":"mousedown").subscribe((function(c){clearTimeout(i.current),n||c.preventDefault(),a&&r(!1),t.current.style.cursor="grabbing",e.current=!0}));return function(){c.unsubscribe()}}),[n])},k=[],E=function(t,e,n,r,a,i,o,u,l,f,m,b,p,d,h,g,j){Object(c.useEffect)((function(){var c=Object(s.a)(window,l?"touchend":"mouseup").pipe(Object(v.a)((function(){return a.current}))).subscribe((function(){!0===p.current&&j(!0),m&&m(!1);var c,s=(c=t.current.style.transform,parseFloat(c.replace("translateX(","").replace("px)","")));t.current.style.transition="0.5s";var l=parseInt(Math.abs(s)/i)+f;Math.abs(n.current)<3&&(l=Math.round(Math.abs(s)/i)+f);if(Math.abs(n.current)>3&&n.current>0&&(l+=1),l===o?t.current.style.transform="translateX(".concat((f-o)*i,"px)"):u(l),g&&h){var b=d+f,v=b+d-1,y=l-o;g+y>=b&&g+y<=v&&h(g+y),g+y<b&&h(v+(g+y-b+1)),g+y>v&&h(b+(g+y-v-1))}t.current.style.cursor="grab",e.current=0,n.current=0,r.current=0,a.current=!1,k=[]}));return function(){c.unsubscribe()}}),[b,g,o,i,l,d])},S=function(t,e,n,r,a,i,o,u,l,f,m,b,p,d){Object(c.useEffect)((function(){var c=Object(s.a)(window,u?"touchmove":"mousemove").pipe(Object(v.a)((function(){return a.current}))).subscribe((function(c){if(u){if(k.length<5)return void k.push(window.scrollY);var a=0;if(5===k.length&&(a=Math.abs(k[k.length-1]-k[0])),a>1)return}m&&!b&&m(!0),p&&d(!1);var s=(l-o)*i;if(n.current=u?e.current-c.touches[0].clientX:e.current-c.clientX,0!==e.current){r.current-=n.current,t.current.style.transition="0s";var h=function(t,e,n){return Math.round(Math.abs(t)/e)+n}(s+r.current,i,l),g=f+l,v=g+f-(l-2);h>=g&&h<=v&&(t.current.style.transform="translateX(".concat(s+r.current,"px)")),h<=g&&(t.current.style.transform="translateX(".concat(s+r.current-i*f,"px)")),h>=v&&(t.current.style.transform="translateX(".concat(s+r.current+i*f,"px)"))}e.current=u?c.touches[0].clientX:c.clientX}));return function(){c.unsubscribe()}}),[o,i,u,l])};function R(t,e,n){var a=Object(c.useRef)(),s=Object(c.useState)(t),o=Object(r.a)(s,2),u=o[0],l=o[1],f=Object(c.useState)(n.length+u),m=Object(r.a)(f,2),b=m[0],p=m[1],d=Object(c.useState)(n.length+u),h=Object(r.a)(d,2),g=h[0],v=h[1],j=Object(c.useState)(),y=Object(r.a)(j,2);return{listProductsWrapperRef:a,amountProductsEachPageStateList:[u,l],realPageStateList:[b,p],pageActiveStateList:[g,v],isDisplayLayerBlockStateList:[y[0],y[1]],isIntervalModeRef:Object(c.useRef)(e),timeoutRef:Object(c.useRef)(),dataList:Object(c.useMemo)((function(){return t=n,[].concat(Object(i.a)(t),Object(i.a)(t),Object(i.a)(t),Object(i.a)(t.slice(0,2)));var t}),[])}}var X=function(t){var e=t.dataImageList,n=t.setPage,i=t.page,s=t.triggerSlideSmallImage,o=R(1,null,e),u=o.amountProductsEachPageStateList,l=o.isDisplayLayerBlockStateList,f=o.dataList,m=o.isIntervalModeRef,b=o.listProductsWrapperRef,p=o.pageActiveStateList,d=o.realPageStateList,h=o.timeoutRef,g=Object(r.a)(u,1)[0],v=Object(r.a)(d,2),j=v[0],k=v[1],X=Object(r.a)(p,2),I=X[0],L=X[1],W=Object(r.a)(l,2),P=W[0],M=W[1],N=b,z=m,T=h,C=Object(c.useRef)(),q=function(t,e){y(N,t,e,T,L,k)};return Object(c.useEffect)((function(){N.current.style.height="".concat(N.current.children[j-1].offsetHeight,"px"),n(j-e.length)}),[j]),Object(c.useEffect)((function(){void 0!==i&&q(i+e.length,!0)}),[s]),function(t,e,n,a,i,s,o,u,l,f,m,b){var p=o.arrayWidthCondition,d=o.setAmountProductsEachPage,h=u.initIsIntervalModeRef,g=u.secondTimeInterval,v=Object(c.useState)(),j=Object(r.a)(v,2),y=j[0],k=j[1],R=Object(c.useState)(),X=Object(r.a)(R,2),I=X[0],L=X[1],W=Object(c.useRef)(),P=Object(c.useRef)(0),M=Object(c.useRef)(0),N=Object(c.useRef)(0),z=Object(c.useState)(h.current),T=Object(r.a)(z,2),C=T[0],q=T[1];Object(c.useEffect)((function(){t.current.style.transform="translateX(".concat(I*(e-n),"px)")}),[m,e,n,I]),w(g,C,m,a,e,t,s,l,f,n),O(t,e,L,k,p,d,m,l,a,f,C,q,h),x(t,W,y,q,C,l),E(t,P,M,N,W,I,n,a,y,e,i,C,h,s,f,m,q),S(t,P,M,N,W,I,n,y,e,s,i,b,C,q)}(N,g,I,L,M,e.length,{arrayWidthCondition:null,setAmountProductsEachPage:null},{initIsIntervalModeRef:z,secondTimeInterval:5},T,k,j,P),a.a.createElement("div",{className:"carousel-slide-list"},a.a.createElement("i",{className:"fas fa-chevron-left carousel-prev-button",onClick:function(){I-e.length>1&&q(I-1,!0),I-e.length!==1||C.current||(N.current.style.transition="0.5s",N.current.style.transform="translateX(".concat(N.current.children[0].offsetWidth*(g-(I-1)),"px)"),N.current.style.height="".concat(N.current.children[I-1-1].offsetHeight,"px"),C.current=setTimeout((function(){q(2*e.length),C.current=null}),500))}}),a.a.createElement("i",{className:"fas fa-chevron-right carousel-next-button",onClick:function(){I-e.length<e.length&&q(I+1,!0),I-e.length!==e.length||C.current||(N.current.style.transition="0.5s",N.current.style.transform="translateX(".concat(N.current.children[0].offsetWidth*(g-(I+1)),"px)"),N.current.style.height="".concat(N.current.children[I].offsetHeight,"px"),C.current=setTimeout((function(){q(1+e.length),C.current=null}),500))}}),a.a.createElement("div",{className:"carousel-slide-list-wrapper",ref:N},f.map((function(t,n){return a.a.createElement("div",{key:n,className:"carousel-slide-item"},a.a.createElement("img",{src:t,alt:"Not found",onLoad:function(){N.current.style.height="".concat(N.current.children[j-1].offsetHeight,"px")},onError:function(){0===n&&(document.body.style.backgroundImage="url(".concat(e[1],")")),N.current.children[n].querySelector("img").src="https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"}}))}))))},I=(n(271),function(t){var e=t.dataImageList,n=t.page,i=t.setPage,o=t.triggerSlideSmallImage,u=t.setTriggerSlideSmallImage,l=Object(c.useRef)(),f=Object(c.useRef)(),m=Object(c.useRef)(0),b=Object(c.useRef)(0),p=Object(c.useRef)([]),d=Object(c.useState)(0),h=Object(r.a)(d,2),g=h[0],y=h[1],O=Object(c.useState)(!1),w=Object(r.a)(O,2),x=w[0],k=w[1],E=Object(c.useRef)(Object(j.a)());return Object(c.useEffect)((function(){var t=l.current.children[0].offsetWidth;l.current.style.transform="translateX(".concat(-t*g,"px)")}),[g]),Object(c.useEffect)((function(){e.length<=4?y(0):n>e.length-4?y(e.length-4):y(n-1)}),[e.length,n]),Object(c.useEffect)((function(){var t=Object(s.a)(l.current,E.current?"touchstart":"mousedown").subscribe((function(t){E.current||t.preventDefault(),f.current=!0})),n=Object(s.a)(window,E.current?"touchmove":"mousemove").pipe(Object(v.a)((function(){return f.current}))).subscribe((function(t){if(E.current){if(p.current.length<5)return void p.current.push(window.scrollY);if(5===p.current.length&&Math.abs(p.current[p.current.length-1]-p.current[0])>1)return}var e=parseFloat(l.current.style.transform.replace("translateX(","").replace("px)"));if(l.current.style.transition="0s",E.current)return b.current=m.current-t.touches[0].clientX,m.current&&(l.current.style.transform="translateX(".concat(e-b.current,"px)")),void(m.current=t.touches[0].clientX);k(!0),l.current.style.transform="translateX(".concat(e+t.movementX,"px)")})),r=Object(s.a)(window,E.current?"touchend":"mouseup").subscribe((function(){f.current=!1,m.current=0,b.current=0,p.current=[],l.current.style.transition="0.5s";var t=l.current.children[0].offsetWidth,n=parseFloat(l.current.style.transform.replace("translateX(","").replace("px)")),r=Math.abs(Math.round(n/t));return n>0||e.length<=4?(k(!1),0===g?void(l.current.style.transform="translateX(".concat(0,"px)")):void y(0)):r>e.length-4?(k(!1),g===e.length-4?void(l.current.style.transform="translateX(".concat(-t*(e.length-4),"px)")):void y(e.length-4)):(k(!1),void(g!==r?y(r):l.current.style.transform="translateX(".concat(-r*t,"px)")))}));return function(){t.unsubscribe(),n.unsubscribe(),r.unsubscribe()}}),[e.length,g]),a.a.createElement("div",{className:"carousel-small-image-list-container"},x&&a.a.createElement("div",{className:"carousel-small-image-overlay"}),0!==g&&a.a.createElement("i",{className:"fas fa-chevron-left small-carousel-prev-button",onClick:function(){g>0&&y(g-1)}}),g<e.length-4&&a.a.createElement("i",{className:"fas fa-chevron-right small-carousel-next-button",onClick:function(){g<e.length-4&&y(g+1)}}),a.a.createElement("div",{className:"carousel-small-image-list-wrapper",ref:l},e.map((function(t,e){return a.a.createElement("div",{key:e,className:"carousel-small-image-item",style:{minWidth:"".concat(25,"%")}},a.a.createElement("img",{src:t,alt:"Not found",style:{opacity:e===n-1?"1":"0.3"},onClick:function(){i(e+1),u(!o)},onError:function(){l.current.children[e].querySelector("img").src="https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"}}))}))))});e.default=function(t){var e=t.listImage,n=t.isLoading,i=Object(c.useState)(1),s=Object(r.a)(i,2),o=s[0],u=s[1],l=Object(c.useState)(!1),f=Object(r.a)(l,2),m=f[0],b=f[1],p=Object(c.useRef)();return a.a.createElement("div",{className:"list-image-anime-detail-container"},a.a.createElement(X,{dataImageList:e,setPage:u,page:o,triggerSlideSmallImage:m,isLoading:n}),a.a.createElement(I,{sliderLargeImageRef:p,dataImageList:e,page:o,setPage:u,triggerSlideSmallImage:m,setTriggerSlideSmallImage:b}))}}}]);
//# sourceMappingURL=41.f52fb431.chunk.js.map