(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[19],{126:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n(2),o=n(40),i=n(123),a=n(21);function c(t,e,n){return void 0===n&&(n=Number.POSITIVE_INFINITY),"function"===typeof e?function(r){return r.pipe(c((function(n,r){return Object(i.a)(t(n,r)).pipe(Object(o.a)((function(t,o){return e(n,t,r,o)})))}),n))}:("number"===typeof e&&(n=e),function(e){return e.lift(new u(t,n))})}var u=function(){function t(t,e){void 0===e&&(e=Number.POSITIVE_INFINITY),this.project=t,this.concurrent=e}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.project,this.concurrent))},t}(),s=function(t){function e(e,n,r){void 0===r&&(r=Number.POSITIVE_INFINITY);var o=t.call(this,e)||this;return o.project=n,o.concurrent=r,o.hasCompleted=!1,o.buffer=[],o.active=0,o.index=0,o}return r.a(e,t),e.prototype._next=function(t){this.active<this.concurrent?this._tryNext(t):this.buffer.push(t)},e.prototype._tryNext=function(t){var e,n=this.index++;try{e=this.project(t,n)}catch(r){return void this.destination.error(r)}this.active++,this._innerSub(e)},e.prototype._innerSub=function(t){var e=new a.a(this),n=this.destination;n.add(e);var r=Object(a.c)(t,e);r!==e&&n.add(r)},e.prototype._complete=function(){this.hasCompleted=!0,0===this.active&&0===this.buffer.length&&this.destination.complete(),this.unsubscribe()},e.prototype.notifyNext=function(t){this.destination.next(t)},e.prototype.notifyComplete=function(){var t=this.buffer;this.active--,t.length>0?this._next(t.shift()):0===this.active&&this.hasCompleted&&this.destination.complete()},e}(a.b)},127:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(54);var o=n(59);function i(t){return function(t){if(Array.isArray(t))return Object(r.a)(t)}(t)||function(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||Object(o.a)(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},128:function(t,e,n){"use strict";function r(){}n.d(e,"a",(function(){return r}))},133:function(t,e,n){"use strict";n(141);var r=n(0),o=n.n(r);e.a=function(t){var e=t.label,n=t.input,r=t.type,i=t.error,a=void 0===i?null:i,c=t.defaultValue,u=void 0===c?"":c,s=t.onKeyUp;return o.a.createElement("div",{style:{width:"100%"}},o.a.createElement("div",{className:"form-custom"},o.a.createElement("input",{onKeyUp:s,defaultValue:u,ref:n,type:r||"text",required:!0}),o.a.createElement("label",{className:"label-name"},e)),a&&o.a.createElement("div",{className:"error-message"},a))}},136:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var r=n(40);function o(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=t.length;if(0===n)throw new Error("list of properties cannot be empty.");return function(e){return Object(r.a)(i(t,n))(e)}}function i(t,e){return function(n){for(var r=n,o=0;o<e;o++){var i=null!=r?r[t[o]]:void 0;if(void 0===i)return;r=i}return r}}},137:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n(2),o=n(40),i=n(123),a=n(21);function c(t,e){return"function"===typeof e?function(n){return n.pipe(c((function(n,r){return Object(i.a)(t(n,r)).pipe(Object(o.a)((function(t,o){return e(n,t,r,o)})))})))}:function(e){return e.lift(new u(t))}}var u=function(){function t(t){this.project=t}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.project))},t}(),s=function(t){function e(e,n){var r=t.call(this,e)||this;return r.project=n,r.index=0,r}return r.a(e,t),e.prototype._next=function(t){var e,n=this.index++;try{e=this.project(t,n)}catch(r){return void this.destination.error(r)}this._innerSub(e)},e.prototype._innerSub=function(t){var e=this.innerSubscription;e&&e.unsubscribe();var n=new a.a(this),r=this.destination;r.add(n),this.innerSubscription=Object(a.c)(t,n),this.innerSubscription!==n&&r.add(this.innerSubscription)},e.prototype._complete=function(){var e=this.innerSubscription;e&&!e.closed||t.prototype._complete.call(this),this.unsubscribe()},e.prototype._unsubscribe=function(){this.innerSubscription=void 0},e.prototype.notifyComplete=function(){this.innerSubscription=void 0,this.isStopped&&t.prototype._complete.call(this)},e.prototype.notifyNext=function(t){this.destination.next(t)},e}(a.b)},140:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(2),o=n(5);function i(t,e){return function(n){return n.lift(new a(t,e))}}var a=function(){function t(t,e){this.predicate=t,this.thisArg=e}return t.prototype.call=function(t,e){return e.subscribe(new c(t,this.predicate,this.thisArg))},t}(),c=function(t){function e(e,n,r){var o=t.call(this,e)||this;return o.predicate=n,o.thisArg=r,o.count=0,o}return r.a(e,t),e.prototype._next=function(t){var e;try{e=this.predicate.call(this.thisArg,t,this.count++)}catch(n){return void this.destination.error(n)}e&&this.destination.next(t)},e}(o.a)},141:function(t,e,n){},148:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(126),o=n(60);function i(t){return void 0===t&&(t=Number.POSITIVE_INFINITY),Object(r.a)(o.a,t)}},149:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n(2),o=n(5),i=n(128),a=n(27);function c(t,e,n){return function(r){return r.lift(new u(t,e,n))}}var u=function(){function t(t,e,n){this.nextOrObserver=t,this.error=e,this.complete=n}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.nextOrObserver,this.error,this.complete))},t}(),s=function(t){function e(e,n,r,o){var c=t.call(this,e)||this;return c._tapNext=i.a,c._tapError=i.a,c._tapComplete=i.a,c._tapError=r||i.a,c._tapComplete=o||i.a,Object(a.a)(n)?(c._context=c,c._tapNext=n):n&&(c._context=n,c._tapNext=n.next||i.a,c._tapError=n.error||i.a,c._tapComplete=n.complete||i.a),c}return r.a(e,t),e.prototype._next=function(t){try{this._tapNext.call(this._context,t)}catch(e){return void this.destination.error(e)}this.destination.next(t)},e.prototype._error=function(t){try{this._tapError.call(this._context,t)}catch(t){return void this.destination.error(t)}this.destination.error(t)},e.prototype._complete=function(){try{this._tapComplete.call(this._context)}catch(t){return void this.destination.error(t)}return this.destination.complete()},e}(o.a)},152:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(83),o=n(153);function i(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return Object(o.a)()(r.a.apply(void 0,t))}},153:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var r=n(148);function o(){return Object(r.a)(1)}},170:function(t,e,n){"use strict";n.d(e,"d",(function(){return b})),n.d(e,"e",(function(){return h})),n.d(e,"a",(function(){return m})),n.d(e,"c",(function(){return v})),n.d(e,"b",(function(){return j}));var r=n(123),o=n(107),i=n(83),a=n(101),c=n(171),u=n(40),s=n(136),l=n(100),f=n(140),p=n(149),d=n(184),b=(n(185),n(137),n(173).a),h=function(t){t.disabled=!0;for(var e=arguments.length,n=new Array(e>1?e-1:0),i=1;i<e;i++)n[i-1]=arguments[i];return Object(r.a)(n.map((function(t){return Object(o.a)(t,"input")}))).pipe(Object(c.a)(),Object(u.a)((function(e){var n=!0,r=e.map((function(t){return 0===t.target.value.length&&(n=!1),t.target.value}));return t.disabled=!n,r})))},m=function(t){return Object(a.a)({url:"/api/theater",headers:{authorization:"Bearer ".concat(t)},method:"GET"}).pipe(Object(s.a)("response","message"),Object(l.a)((function(){return Object(i.a)([])})))},v=function(t,e,n,r){return Object(o.a)(t,"keyup").pipe(Object(f.a)((function(t){return 13===t.keyCode})),Object(p.a)((function(){return r(null)})),Object(s.a)("target","value"),Object(d.a)((function(t){return Object(a.a)({method:"POST",url:"/api/theater/".concat(e,"/join"),headers:{authorization:"Bearer ".concat(n)},body:{password:t}}).pipe(Object(l.a)((function(t){return r(t?t.response.error:null),Object(i.a)(null)})))})))},j=function(t,e){return Object(a.a)({url:"/api/theater/".concat(t,"/members"),headers:{authorization:"Bearer ".concat(e)}}).pipe(Object(s.a)("response","message"),Object(l.a)((function(){return Object(i.a)([])})))}},173:function(t,e,n){"use strict";n.d(e,"c",(function(){return l})),n.d(e,"f",(function(){return f})),n.d(e,"b",(function(){return p})),n.d(e,"d",(function(){return d})),n.d(e,"e",(function(){return b}));var r=n(30),o=n(75),i=n(209),a=new o.a,c={rooms:[],allowFetchRooms:!0,currentRoomDetail:null,isSignIn:!1,notifications:[],roomsLoginId:[],allowFetchCurrentRoomDetail:!0,usersOnline:[],modeRoom:1,userId:null,allowRemoveVideoWatch:!0,allowUserJoin:!0,unreadMessage:0,groupId:null,timePlayingVideo:0,videoUrl:null,isVideoCall:!1,isControlVideoWatching:!1,isReconnect:!1,isTriggerReconnect:!1,isVideoWatchPlaying:!1,peerId:null,isDisableReconnectButton:!1},u=c,s={initialState:c,socket:i.a.connect("/",{upgrade:!1,transports:["websocket"]}),subscribe:function(t){return a.subscribe(t)},currentState:function(){var t;return a.subscribe((function(e){return t=e})),t||c},init:function(){a.next(u)},updateData:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:c;u=Object(r.a)(Object(r.a)({},u),t),a.next(u)}},l=function(t){u.allowFetchRooms=t},f=function(t){u.isSignIn=t},p=function(t){u.allowFetchCurrentRoomDetail=t},d=function(t){u.allowRemoveVideoWatch=t},b=function(t){u.allowUserJoin=t};e.a=s},242:function(t,e,n){},351:function(t,e,n){"use strict";n.r(e);var r=n(18),o=n.n(r),i=n(127),a=n(36),c=n(26),u=(n(242),n(7)),s=n(0),l=n.n(s),f=n(120),p=n(3),d=n(13),b=n(133),h=n(170),m=n(107),v=n(53),j=n(102),O=n(173),y=function(t,e,n){Object(s.useEffect)(function(t,e,n){return function(){var r=h.d.subscribe(t);h.d.init();var o=Object(m.a)(n.current,"input").pipe(Object(j.a)(400,v.b,{leading:!0,trailing:!0})).subscribe((function(t){e(t.target.value)}));return function(){Object(O.e)(!1),o.unsubscribe(),r.unsubscribe()}}}(t,e,n),[])},w=function(t,e,n,r,o){Object(s.useEffect)(function(t,e,n,r,o){return function(){t.allowFetchRooms&&Object(h.a)(e.idCartoonUser).subscribe((function(t){h.d.updateData({rooms:t}),Object(O.c)(!1)}));var i=Object(h.e)(n.current,r.current,o.current).subscribe();return function(){i.unsubscribe()}}}(t,e,n,r,o),[e.idCartoonUser,t.allowFetchRooms])},g=Object(u.a)((function(){return Promise.all([n.e(65),n.e(58)]).then(n.bind(null,337))})),E=Object(u.a)((function(){return Promise.all([n.e(29),n.e(51)]).then(n.bind(null,338))}),{fallback:l.a.createElement("i",{className:"fas fa-spinner fa-9x fa-spin"})});function x(t){var e=t.rooms,n=t.locationPath,r=t.inputSearchRoom;return l.a.createElement("div",{className:"container-room-list"},l.a.createElement(b.a,{label:"Search room",input:r}),e&&e.map((function(t,e){return l.a.createElement(d.b,{to:"/theater/".concat(t.groupId),className:"room-link-item".concat(n===t.groupId?" active-link":""),onClick:function(){Object(O.f)(!1),Object(O.b)(!0)},key:e},l.a.createElement("div",{style:{display:"flex",paddingRight:"1.2rem"}},t.roomName))})))}function N(t){var e=t.inputRoomNameRef,n=t.inputPasswordRef,r=t.buttonSubmitRef,c=t.cookies,u=t.roomNameError,s=t.passwordError,f=t.setRoomNameError,p=t.setPasswordError;return l.a.createElement("div",{className:"input-room-layout"},l.a.createElement("h1",null,"Create Room"),l.a.createElement(b.a,{label:"Room Name",input:e,error:u}),l.a.createElement(b.a,{label:"Password",type:"password",input:n,error:s}),l.a.createElement("button",{className:"btn btn-primary",onClick:Object(a.a)(o.a.mark((function t(){var a,u,s;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a={roomName:e.current.value,password:n.current.value},r.current.disabled=!0,t.prev=2,t.next=5,fetch("/api/theater",{method:"POST",body:JSON.stringify(a),headers:{authorization:"Bearer ".concat(c.idCartoonUser),"Content-Type":"application/json"}});case 5:return u=t.sent,t.next=8,u.json();case 8:if(s=t.sent,console.log(s.error),!s.error){t.next=12;break}throw Error(s.error);case 12:Object(O.c)(!0),e.current.value="",n.current.value="",h.d.updateData({rooms:[].concat(Object(i.a)(h.d.currentState().rooms),[s.message])}),t.next=22;break;case 18:t.prev=18,t.t0=t.catch(2),t.t0.message.toLowerCase().includes("roomname")?(f(t.t0.message),e.current.value=""):(f(null),e.current.value="",n.current.value=""),t.t0.message.toLowerCase().includes("password")?(p(t.t0.message),n.current.value=""):(e.current.value="",n.current.value="",p(null));case 22:case"end":return t.stop()}}),t,null,[[2,18]])}))),ref:r},"Submit"))}e.default=function(t){var e=t.location.pathname.replace(/\/theater\//g,""),n=Object(s.useState)(h.d.initialState),r=Object(c.a)(n,2),o=r[0],i=r[1],a=Object(f.a)(["idCartoonUser"]),u=Object(c.a)(a,1)[0],d=Object(s.useState)(null),b=Object(c.a)(d,2),m=b[0],v=b[1],j=Object(s.useState)(null),O=Object(c.a)(j,2),_=O[0],S=O[1],R=Object(s.useState)(""),I=Object(c.a)(R,2),C=I[0],k=I[1],P=Object(s.useRef)(),T=Object(s.useRef)(),V=Object(s.useRef)(),F=Object(s.useRef)();return y(i,k,F),w(o,u,V,P,T),l.a.createElement("div",{className:"container-theater-watch"},l.a.createElement(g,{mode:o.modeRoom}),l.a.createElement("div",{className:"container-room",style:{borderRight:1===o.modeRoom?"1px solid #ffffff70":"none",maxWidth:1===o.modeRoom?"300px":"0",minWidth:1===o.modeRoom?"300px":"0"}},l.a.createElement(x,{rooms:o.rooms.filter((function(t){return t.roomName.toLocaleLowerCase().includes(C)})),locationPath:e,inputSearchRoom:F}),l.a.createElement(N,{inputRoomNameRef:P,inputPasswordRef:T,buttonSubmitRef:V,cookies:u,roomNameError:m,passwordError:_,setRoomNameError:v,setPasswordError:S})),l.a.createElement("div",{className:"container-watch-interface"},l.a.createElement(p.c,null,l.a.createElement(p.a,{path:"/theater/:groupId",component:E}))))}}}]);
//# sourceMappingURL=19.f2d681cf.chunk.js.map