(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[28,66],{123:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n(12),u=n(58),o=n(130);function a(e,t){return t?Object(o.a)(e,t):e instanceof r.a?e:new r.a(Object(u.a)(e))}},125:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var r=n(41);function u(e){return!Object(r.a)(e)&&e-parseFloat(e)+1>=0}},130:function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var r=n(12),u=n(15),o=n(31);var a=n(43),i=n(42);var c=n(62),s=n(61);function l(e,t){if(null!=e){if(function(e){return e&&"function"===typeof e[o.a]}(e))return function(e,t){return new r.a((function(n){var r=new u.a;return r.add(t.schedule((function(){var u=e[o.a]();r.add(u.subscribe({next:function(e){r.add(t.schedule((function(){return n.next(e)})))},error:function(e){r.add(t.schedule((function(){return n.error(e)})))},complete:function(){r.add(t.schedule((function(){return n.complete()})))}}))}))),r}))}(e,t);if(Object(c.a)(e))return function(e,t){return new r.a((function(n){var r=new u.a;return r.add(t.schedule((function(){return e.then((function(e){r.add(t.schedule((function(){n.next(e),r.add(t.schedule((function(){return n.complete()})))})))}),(function(e){r.add(t.schedule((function(){return n.error(e)})))}))}))),r}))}(e,t);if(Object(s.a)(e))return Object(a.a)(e,t);if(function(e){return e&&"function"===typeof e[i.a]}(e)||"string"===typeof e)return function(e,t){if(!e)throw new Error("Iterable cannot be null");return new r.a((function(n){var r,o=new u.a;return o.add((function(){r&&"function"===typeof r.return&&r.return()})),o.add(t.schedule((function(){r=e[i.a](),o.add(t.schedule((function(){if(!n.closed){var e,t;try{var u=r.next();e=u.value,t=u.done}catch(o){return void n.error(o)}t?n.complete():(n.next(e),this.schedule())}})))}))),o}))}(e,t)}throw new TypeError((null!==e&&typeof e||e)+" is not observable")}},133:function(e,t,n){"use strict";n(141);var r=n(0),u=n.n(r);t.a=function(e){var t=e.label,n=e.input,r=e.type,o=e.error,a=void 0===o?null:o,i=e.defaultValue,c=void 0===i?"":i,s=e.onKeyUp;return u.a.createElement("div",{style:{width:"100%"}},u.a.createElement("div",{className:"form-custom"},u.a.createElement("input",{onKeyUp:s,defaultValue:c,ref:n,type:r||"text",required:!0}),u.a.createElement("label",{className:"label-name"},t)),a&&u.a.createElement("div",{className:"error-message"},a))}},136:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var r=n(40);function u(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var n=e.length;if(0===n)throw new Error("list of properties cannot be empty.");return function(t){return Object(r.a)(o(e,n))(t)}}function o(e,t){return function(n){for(var r=n,u=0;u<t;u++){var o=null!=r?r[e[u]]:void 0;if(void 0===o)return;r=o}return r}}},141:function(e,t,n){},142:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=n(12),u=n(53),o=n(125),a=n(57);function i(e,t,n){void 0===e&&(e=0);var i=-1;return Object(o.a)(t)?i=Number(t)<1?1:Number(t):Object(a.a)(t)&&(n=t),Object(a.a)(n)||(n=u.a),new r.a((function(t){var r=Object(o.a)(e)?e:+e-n.now();return n.schedule(c,r,{index:0,period:i,subscriber:t})}))}function c(e){var t=e.index,n=e.period,r=e.subscriber;if(r.next(t),!r.closed){if(-1===n)return r.complete();e.index=t+1,this.schedule(e,n)}}},150:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var r=n(2),u=n(5),o=n(53);function a(e,t){return void 0===t&&(t=o.a),function(n){return n.lift(new i(e,t))}}var i=function(){function e(e,t){this.dueTime=e,this.scheduler=t}return e.prototype.call=function(e,t){return t.subscribe(new c(e,this.dueTime,this.scheduler))},e}(),c=function(e){function t(t,n,r){var u=e.call(this,t)||this;return u.dueTime=n,u.scheduler=r,u.debouncedSubscription=null,u.lastValue=null,u.hasValue=!1,u}return r.a(t,e),t.prototype._next=function(e){this.clearDebounce(),this.lastValue=e,this.hasValue=!0,this.add(this.debouncedSubscription=this.scheduler.schedule(s,this.dueTime,this))},t.prototype._complete=function(){this.debouncedNext(),this.destination.complete()},t.prototype.debouncedNext=function(){if(this.clearDebounce(),this.hasValue){var e=this.lastValue;this.lastValue=null,this.hasValue=!1,this.destination.next(e)}},t.prototype.clearDebounce=function(){var e=this.debouncedSubscription;null!==e&&(this.remove(e),e.unsubscribe(),this.debouncedSubscription=null)},t}(u.a);function s(e){e.debouncedNext()}},184:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=n(2),u=n(40),o=n(123),a=n(21);function i(e,t){return t?function(n){return n.pipe(i((function(n,r){return Object(o.a)(e(n,r)).pipe(Object(u.a)((function(e,u){return t(n,e,r,u)})))})))}:function(t){return t.lift(new c(e))}}var c=function(){function e(e){this.project=e}return e.prototype.call=function(e,t){return t.subscribe(new s(e,this.project))},e}(),s=function(e){function t(t,n){var r=e.call(this,t)||this;return r.project=n,r.hasSubscription=!1,r.hasCompleted=!1,r.index=0,r}return r.a(t,e),t.prototype._next=function(e){this.hasSubscription||this.tryNext(e)},t.prototype.tryNext=function(e){var t,n=this.index++;try{t=this.project(e,n)}catch(r){return void this.destination.error(r)}this.hasSubscription=!0,this._innerSub(t)},t.prototype._innerSub=function(e){var t=new a.a(this),n=this.destination;n.add(t);var r=Object(a.c)(e,t);r!==t&&n.add(r)},t.prototype._complete=function(){this.hasCompleted=!0,this.hasSubscription||this.destination.complete(),this.unsubscribe()},t.prototype.notifyNext=function(e){this.destination.next(e)},t.prototype.notifyError=function(e){this.destination.error(e)},t.prototype.notifyComplete=function(){this.hasSubscription=!1,this.hasCompleted&&this.destination.complete()},t}(a.b)},219:function(e,t,n){},327:function(e,t,n){"use strict";n.r(t);var r=n(30),u=n(26),o=(n(219),n(0)),a=n.n(o),i=n(120),c=n(142),s=n(123),l=n(101),d=n(150),f=n(184),p=n(136),b=n(100),h=n(22),m=n(133);t.default=function(){var e=h.b.currentState(),t=Object(o.useRef)(),n=Object(o.useRef)(),v=Object(o.useRef)(),j=Object(o.useRef)(),w=Object(i.a)(["idCartoonUser"]),O=Object(u.a)(w,2),y=O[0],x=O[1],S=Object(o.useState)(null),E=Object(u.a)(S,2),N=E[0],C=E[1],V=Object(o.useState)(null),g=Object(u.a)(V,2),U=g[0],T=g[1],_=Object(o.useState)(null),D=Object(u.a)(_,2),L=D[0],P=D[1],R=Object(o.useState)(null),k=Object(u.a)(R,2),I=k[0],Y=k[1];return Object(o.useEffect)((function(){var e=document.querySelector(".button-scroll-top");return e.style.transform="translateY(500px)",function(){0===window.scrollY&&(e.style.transform="translateY(0)")}}),[]),a.a.createElement("div",{className:"container-edit-user"},a.a.createElement("h1",null,"Change information your account"),a.a.createElement(m.a,{label:"New Username",defaultValue:e.username,input:t,error:L}),a.a.createElement(m.a,{label:"New Email",input:n,error:U}),a.a.createElement(m.a,{label:"Current Password",type:"password",input:v,error:N}),a.a.createElement(m.a,{label:"New Password",type:"password",input:j,error:I}),a.a.createElement("button",{className:"btn btn-primary button-submit-edit",onClick:function(){return function(e,t,n,u,o,a,i,m,v){var j=function(e,t,n,u){var o={userId:h.b.currentState().userId,password:n.value};e.value&&(o=Object(r.a)(Object(r.a)({},o),{},{newUsername:e.value}));u.value&&(o=Object(r.a)(Object(r.a)({},o),{},{newPassword:u.value}));t.value&&(o=Object(r.a)(Object(r.a)({},o),{},{newEmail:t.value}));return o}(e,t,n,u);return Object(c.a)(0).pipe(Object(d.a)(500),Object(f.a)((function(){return Object(l.a)({method:"PUT",url:"/api/users/current",body:j,headers:{authorization:"Bearer ".concat(o)}}).pipe(Object(p.a)("response","message"),Object(b.a)((function(e){return e.response.error.replace(/ /g,"").toLowerCase().includes("currentpassword")?(a(e.response.error),Object(s.a)([])):(a(null),e.response.error.toLowerCase().includes("email")?(i(e.response.error),Object(s.a)([])):(i(null),e.response.error.toLowerCase().includes("username")?(m(e.response.error),Object(s.a)([])):(m(null),e.response.error.toLowerCase().includes("password")?(v(e.response.error),Object(s.a)([])):(v(null),alert(e.response.error),Object(s.a)([])))))})))})))}(t.current,n.current,v.current,j.current,y.idCartoonUser,C,T,P,Y).subscribe((function(e){x("idCartoonUser",e,{expires:new Date(Date.now()+432e5),path:"/"}),alert("Success changing your account"),window.location.replace("/")}))}},"Submit"))}}}]);
//# sourceMappingURL=28.9dc5a76c.chunk.js.map