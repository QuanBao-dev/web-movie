(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[24],{125:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n(41);function a(e){return!Object(r.a)(e)&&e-parseFloat(e)+1>=0}},126:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(2),a=n(40),c=n(123),i=n(21);function o(e,t,n){return void 0===n&&(n=Number.POSITIVE_INFINITY),"function"===typeof t?function(r){return r.pipe(o((function(n,r){return Object(c.a)(e(n,r)).pipe(Object(a.a)((function(e,a){return t(n,e,r,a)})))}),n))}:("number"===typeof t&&(n=t),function(t){return t.lift(new u(e,n))})}var u=function(){function e(e,t){void 0===t&&(t=Number.POSITIVE_INFINITY),this.project=e,this.concurrent=t}return e.prototype.call=function(e,t){return t.subscribe(new s(e,this.project,this.concurrent))},e}(),s=function(e){function t(t,n,r){void 0===r&&(r=Number.POSITIVE_INFINITY);var a=e.call(this,t)||this;return a.project=n,a.concurrent=r,a.hasCompleted=!1,a.buffer=[],a.active=0,a.index=0,a}return r.a(t,e),t.prototype._next=function(e){this.active<this.concurrent?this._tryNext(e):this.buffer.push(e)},t.prototype._tryNext=function(e){var t,n=this.index++;try{t=this.project(e,n)}catch(r){return void this.destination.error(r)}this.active++,this._innerSub(t)},t.prototype._innerSub=function(e){var t=new i.a(this),n=this.destination;n.add(t);var r=Object(i.c)(e,t);r!==t&&n.add(r)},t.prototype._complete=function(){this.hasCompleted=!0,0===this.active&&0===this.buffer.length&&this.destination.complete(),this.unsubscribe()},t.prototype.notifyNext=function(e){this.destination.next(e)},t.prototype.notifyComplete=function(){var e=this.buffer;this.active--,e.length>0?this._next(e.shift()):0===this.active&&this.hasCompleted&&this.destination.complete()},t}(i.b)},133:function(e,t,n){"use strict";n(141);var r=n(0),a=n.n(r);t.a=function(e){var t=e.label,n=e.input,r=e.type,c=e.error,i=void 0===c?null:c,o=e.defaultValue,u=void 0===o?"":o,s=e.onKeyUp;return a.a.createElement("div",{style:{width:"100%"}},a.a.createElement("div",{className:"form-custom"},a.a.createElement("input",{onKeyUp:s,defaultValue:u,ref:n,type:r||"text",required:!0}),a.a.createElement("label",{className:"label-name"},t)),i&&a.a.createElement("div",{className:"error-message"},i))}},136:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n(40);function a(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var n=e.length;if(0===n)throw new Error("list of properties cannot be empty.");return function(t){return Object(r.a)(c(e,n))(t)}}function c(e,t){return function(n){for(var r=n,a=0;a<t;a++){var c=null!=r?r[e[a]]:void 0;if(void 0===c)return;r=c}return r}}},140:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var r=n(2),a=n(5);function c(e,t){return function(n){return n.lift(new i(e,t))}}var i=function(){function e(e,t){this.predicate=e,this.thisArg=t}return e.prototype.call=function(e,t){return t.subscribe(new o(e,this.predicate,this.thisArg))},e}(),o=function(e){function t(t,n,r){var a=e.call(this,t)||this;return a.predicate=n,a.thisArg=r,a.count=0,a}return r.a(t,e),t.prototype._next=function(e){var t;try{t=this.predicate.call(this.thisArg,e,this.count++)}catch(n){return void this.destination.error(n)}t&&this.destination.next(e)},t}(a.a)},141:function(e,t,n){},142:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(12),a=n(53),c=n(125),i=n(57);function o(e,t,n){void 0===e&&(e=0);var o=-1;return Object(c.a)(t)?o=Number(t)<1?1:Number(t):Object(i.a)(t)&&(n=t),Object(i.a)(n)||(n=a.a),new r.a((function(t){var r=Object(c.a)(e)?e:+e-n.now();return n.schedule(u,r,{index:0,period:o,subscriber:t})}))}function u(e){var t=e.index,n=e.period,r=e.subscriber;if(r.next(t),!r.closed){if(-1===n)return r.complete();e.index=t+1,this.schedule(e,n)}}},159:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n(126);function a(e,t,n){return void 0===n&&(n=Number.POSITIVE_INFINITY),"function"===typeof t?Object(r.a)((function(){return e}),t,n):("number"===typeof t&&(n=t),Object(r.a)((function(){return e}),n))}},178:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=n(12),a=n(53),c=n(125);function i(e,t){return void 0===e&&(e=0),void 0===t&&(t=a.a),(!Object(c.a)(e)||e<0)&&(e=0),t&&"function"===typeof t.schedule||(t=a.a),new r.a((function(n){return n.add(t.schedule(o,e,{subscriber:n,counter:0,period:e})),n}))}function o(e){var t=e.subscriber,n=e.counter,r=e.period;t.next(n),this.schedule({subscriber:t,counter:n+1,period:r},r)}},268:function(e,t,n){},269:function(e,t,n){},306:function(e,t,n){"use strict";n.r(t);var r=n(26),a=(n(268),n(7)),c=n(0),i=n.n(c),o=n(3),u=n(142),s=n(83),l=n(101),f=n(140),d=n(159),m=n(136),b=n(100),p=n(30),h=n(75),v={dataCarousel:[],isShowFormEditCarousel:!1},y=new h.a(v),E=v,j={initialState:v,subscribe:function(e){return y.subscribe((function(t){return e(t)}))},currentState:function(){var e;return y.subscribe((function(t){e=t})),e||v},init:function(){y.next(E)},updateData:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v;E=Object(p.a)(Object(p.a)({},E),e),y.next(E)},updateDataQuick:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v,t=Object.keys(e);t.forEach((function(t){E[t]=e[t]}))}};var O=n(22),N=n(178),S=function(){return function(){var e=Object(u.a)(0).pipe(Object(f.a)((function(){return 0===j.currentState().dataCarousel.length})),Object(d.a)(Object(l.a)("/api/movies/carousel").pipe(Object(m.a)("response","message"),Object(b.a)((function(e){return Object(s.a)({error:e})}))))).subscribe((function(e){e.error||j.updateData({dataCarousel:e})}));return function(){e.unsubscribe()}}},g=function(e){var t;Object(c.useEffect)((t=e,function(){var e=j.subscribe(t);return j.init(),function(){e.unsubscribe()}}),[])},x=function(e,t){Object(c.useEffect)(function(e,t){return function(){var n=Object(N.a)(5e3).subscribe((function(){var n=e;document.querySelector(".section-carousel-container").style.transition="0.4s",t(n+1)}));return function(){n.unsubscribe()}}}(e,t),[e])},w=n(18),I=n.n(w),k=n(36),C=(n(269),n(120)),_=n(44),q=n(133);function T(e){return new Promise((function(t,n){var r=new FileReader;r.onerror=function(){n("Your file is too big")},r.onload=function(e){r.error&&n(r.error),t(e.target.result)},r.readAsDataURL(e)}))}var F=function(){var e=[Object(c.useRef)(),Object(c.useRef)(),Object(c.useRef)()],t=e[0],n=e[1],a=e[2],o=Object(C.a)(["idCartoonUser"]),u=Object(r.a)(o,1)[0],s={},l={},f={};return j.currentState().isShowFormEditCarousel&&(s={transform:"translateY(0)"},l={display:"block"},f={zIndex:12}),i.a.createElement("div",{style:f,className:"form-edit-carousel-container"},i.a.createElement("div",{style:l,className:"form-edit-carousel-container__background",onClick:function(){j.updateData({isShowFormEditCarousel:!1})}}),i.a.createElement("form",{className:"form-edit-carousel-wrapper",style:s},i.a.createElement(q.a,{label:"Mal Id",input:t}),i.a.createElement(q.a,{label:"Id (0 - 4)",input:n,type:"number"}),i.a.createElement(q.a,{label:"Image Url",input:a}),i.a.createElement("input",{className:"file-upload-carousel",type:"file",style:{width:"100%",marginTop:"1rem"}}),i.a.createElement("button",{className:"button-submit-carousel",onClick:function(){var e=Object(k.a)(I.a.mark((function e(r){var c,i,o,s;return I.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r.preventDefault(),c=document.querySelector.bind(document),[t.current.value.trim(),a.current.value.trim(),n.current.value.trim()].includes("")&&[t.current.value.trim(),n.current.value.trim(),c(".file-upload-carousel").value.trim()].includes("")){e.next=26;break}if(e.prev=3,_.a.updateIsShowBlockPopUp(!0),i="",""===c(".file-upload-carousel").value.trim()){e.next=12;break}return e.next=9,T(c(".file-upload-carousel").files[0]);case 9:i=e.sent,e.next=13;break;case 12:i=a.current.value;case 13:return e.next=15,fetch("/api/movies/carousel/"+n.current.value,{method:"PUT",body:JSON.stringify({malId:t.current.value,url:i}),headers:{authorization:"Bearer ".concat(u.idCartoonUser),"Content-Type":"application/json"}});case 15:return o=e.sent,e.next=18,o.json();case 18:if(!(s=e.sent).error){e.next=21;break}throw Error("Some things went wrong");case 21:j.updateData({dataCarousel:s.message,isShowFormEditCarousel:!1}),e.next=26;break;case 24:e.prev=24,e.t0=e.catch(3);case 26:_.a.updateIsShowBlockPopUp(!1);case 27:case"end":return e.stop()}}),e,null,[[3,24]])})));return function(t){return e.apply(this,arguments)}}()},"Submit")))},U=Object(a.a)((function(){return Promise.all([n.e(0),n.e(45)]).then(n.bind(null,343))}),{fallback:i.a.createElement("div",{className:"section-carousel-container"},i.a.createElement("i",{className:"fas fa-spinner fa-9x fa-spin"}))});t.default=function(){var e=O.b.currentState(),t=Object(c.useState)(j.currentState()),n=Object(r.a)(t,2),a=n[0],u=n[1],s=Object(c.useState)(0),l=Object(r.a)(s,2),f=l[0],d=l[1],m=Object(o.f)();g(u),Object(c.useEffect)(S(),[]),x(f,d);var b=a.dataCarousel;Object(c.useEffect)((function(){f===b.length&&setTimeout((function(){document.querySelector(".section-carousel-container")&&(document.querySelector(".section-carousel-container").style.transition="0s",d(0))}),400),-1===f&&setTimeout((function(){document.querySelector(".section-carousel-container")&&(document.querySelector(".section-carousel-container").style.transition="0s",d(b.length-1))}),400)}),[f]);var p=-1===f?b.length-1:f===b.length?0:f;return i.a.createElement("div",null,i.a.createElement(F,null),i.a.createElement("div",{className:"background"},i.a.createElement("div",{className:"container-menu-control"},i.a.createElement("div",{className:"button-left hover-button",onClick:function(){var e=f;e-1>=-1&&(document.querySelector(".section-carousel-container").style.transition="0.4s",d(e-1))}},i.a.createElement("i",{className:"fas fa-caret-left fa-4x"})),i.a.createElement("div",{className:"button-right hover-button",onClick:function(){var e=f;e+1<=b.length&&(document.querySelector(".section-carousel-container").style.transition="0.4s",d(e+1))}},i.a.createElement("i",{className:"fas fa-caret-right fa-4x"}))),e&&"Admin"===e.role&&i.a.createElement("div",{className:"button-update-carousel-container"},i.a.createElement("button",{className:"btn btn-success",onClick:function(){j.updateData({isShowFormEditCarousel:!0})}},"Update")),i.a.createElement("section",{className:"layout-section"},i.a.createElement("div",{className:"section-carousel-container",style:{transform:"translateX(".concat(document.querySelector(".item")?-document.querySelector(".item").offsetWidth*f-document.querySelector(".item").offsetWidth:-document.body.scrollWidth,"px)")}},b&&b[b.length-1]&&i.a.createElement(U,{data:b[b.length-1]}),b&&b.map((function(e){return i.a.createElement(U,{key:e.malId,data:e})})),b&&b[0]&&i.a.createElement(U,{data:b[0],history:m})))),i.a.createElement("div",{className:"list-dot-carousel"},b&&b.map((function(e,t){return i.a.createElement("div",{key:t,onClick:function(){document.querySelector(".section-carousel-container").style.transition="0.4s",d(t)},className:"dot-item".concat(p===t?" active-dot":"")})}))))}}}]);
//# sourceMappingURL=24.a867224a.chunk.js.map