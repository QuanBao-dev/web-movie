(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[17],{123:function(t,e,n){"use strict";n.d(e,"a",(function(){return u}));var r=n(12),i=n(58),a=n(130);function u(t,e){return e?Object(a.a)(t,e):t instanceof r.a?t:new r.a(Object(i.a)(t))}},125:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(41);function i(t){return!Object(r.a)(t)&&t-parseFloat(t)+1>=0}},126:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n(2),i=n(40),a=n(123),u=n(21);function c(t,e,n){return void 0===n&&(n=Number.POSITIVE_INFINITY),"function"===typeof e?function(r){return r.pipe(c((function(n,r){return Object(a.a)(t(n,r)).pipe(Object(i.a)((function(t,i){return e(n,t,r,i)})))}),n))}:("number"===typeof e&&(n=e),function(e){return e.lift(new o(t,n))})}var o=function(){function t(t,e){void 0===e&&(e=Number.POSITIVE_INFINITY),this.project=t,this.concurrent=e}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.project,this.concurrent))},t}(),s=function(t){function e(e,n,r){void 0===r&&(r=Number.POSITIVE_INFINITY);var i=t.call(this,e)||this;return i.project=n,i.concurrent=r,i.hasCompleted=!1,i.buffer=[],i.active=0,i.index=0,i}return r.a(e,t),e.prototype._next=function(t){this.active<this.concurrent?this._tryNext(t):this.buffer.push(t)},e.prototype._tryNext=function(t){var e,n=this.index++;try{e=this.project(t,n)}catch(r){return void this.destination.error(r)}this.active++,this._innerSub(e)},e.prototype._innerSub=function(t){var e=new u.a(this),n=this.destination;n.add(e);var r=Object(u.c)(t,e);r!==e&&n.add(r)},e.prototype._complete=function(){this.hasCompleted=!0,0===this.active&&0===this.buffer.length&&this.destination.complete(),this.unsubscribe()},e.prototype.notifyNext=function(t){this.destination.next(t)},e.prototype.notifyComplete=function(){var t=this.buffer;this.active--,t.length>0?this._next(t.shift()):0===this.active&&this.hasCompleted&&this.destination.complete()},e}(u.b)},127:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(54);var i=n(59);function a(t){return function(t){if(Array.isArray(t))return Object(r.a)(t)}(t)||function(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||Object(i.a)(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},130:function(t,e,n){"use strict";n.d(e,"a",(function(){return l}));var r=n(12),i=n(15),a=n(31);var u=n(43),c=n(42);var o=n(62),s=n(61);function l(t,e){if(null!=t){if(function(t){return t&&"function"===typeof t[a.a]}(t))return function(t,e){return new r.a((function(n){var r=new i.a;return r.add(e.schedule((function(){var i=t[a.a]();r.add(i.subscribe({next:function(t){r.add(e.schedule((function(){return n.next(t)})))},error:function(t){r.add(e.schedule((function(){return n.error(t)})))},complete:function(){r.add(e.schedule((function(){return n.complete()})))}}))}))),r}))}(t,e);if(Object(o.a)(t))return function(t,e){return new r.a((function(n){var r=new i.a;return r.add(e.schedule((function(){return t.then((function(t){r.add(e.schedule((function(){n.next(t),r.add(e.schedule((function(){return n.complete()})))})))}),(function(t){r.add(e.schedule((function(){return n.error(t)})))}))}))),r}))}(t,e);if(Object(s.a)(t))return Object(u.a)(t,e);if(function(t){return t&&"function"===typeof t[c.a]}(t)||"string"===typeof t)return function(t,e){if(!t)throw new Error("Iterable cannot be null");return new r.a((function(n){var r,a=new i.a;return a.add((function(){r&&"function"===typeof r.return&&r.return()})),a.add(e.schedule((function(){r=t[c.a](),a.add(e.schedule((function(){if(!n.closed){var t,e;try{var i=r.next();t=i.value,e=i.done}catch(a){return void n.error(a)}e?n.complete():(n.next(t),this.schedule())}})))}))),a}))}(t,e)}throw new TypeError((null!==t&&typeof t||t)+" is not observable")}},136:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(40);function i(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=t.length;if(0===n)throw new Error("list of properties cannot be empty.");return function(e){return Object(r.a)(a(t,n))(e)}}function a(t,e){return function(n){for(var r=n,i=0;i<e;i++){var a=null!=r?r[t[i]]:void 0;if(void 0===a)return;r=a}return r}}},142:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n(12),i=n(53),a=n(125),u=n(57);function c(t,e,n){void 0===t&&(t=0);var c=-1;return Object(a.a)(e)?c=Number(e)<1?1:Number(e):Object(u.a)(e)&&(n=e),Object(u.a)(n)||(n=i.a),new r.a((function(e){var r=Object(a.a)(t)?t:+t-n.now();return n.schedule(o,r,{index:0,period:c,subscriber:e})}))}function o(t){var e=t.index,n=t.period,r=t.subscriber;if(r.next(e),!r.closed){if(-1===n)return r.complete();t.index=e+1,this.schedule(t,n)}}},144:function(t,e,n){"use strict";n.d(e,"b",(function(){return l})),n.d(e,"a",(function(){return f}));var r=n(2),i=n(57),a=n(41),u=n(145),c=n(147),o=n(63),s={};function l(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=void 0,r=void 0;return Object(i.a)(t[t.length-1])&&(r=t.pop()),"function"===typeof t[t.length-1]&&(n=t.pop()),1===t.length&&Object(a.a)(t[0])&&(t=t[0]),Object(o.a)(t,r).lift(new f(n))}var f=function(){function t(t){this.resultSelector=t}return t.prototype.call=function(t,e){return e.subscribe(new d(t,this.resultSelector))},t}(),d=function(t){function e(e,n){var r=t.call(this,e)||this;return r.resultSelector=n,r.active=0,r.values=[],r.observables=[],r}return r.a(e,t),e.prototype._next=function(t){this.values.push(s),this.observables.push(t)},e.prototype._complete=function(){var t=this.observables,e=t.length;if(0===e)this.destination.complete();else{this.active=e,this.toRespond=e;for(var n=0;n<e;n++){var r=t[n];this.add(Object(c.a)(this,r,void 0,n))}}},e.prototype.notifyComplete=function(t){0===(this.active-=1)&&this.destination.complete()},e.prototype.notifyNext=function(t,e,n){var r=this.values,i=r[n],a=this.toRespond?i===s?--this.toRespond:this.toRespond:0;r[n]=e,0===a&&(this.resultSelector?this._tryResultSelector(r):this.destination.next(r.slice()))},e.prototype._tryResultSelector=function(t){var e;try{e=this.resultSelector.apply(this,t)}catch(n){return void this.destination.error(n)}this.destination.next(e)},e}(u.a)},145:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(2),i=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return r.a(e,t),e.prototype.notifyNext=function(t,e,n,r,i){this.destination.next(e)},e.prototype.notifyError=function(t,e){this.destination.error(t)},e.prototype.notifyComplete=function(t){this.destination.complete()},e}(n(5).a)},147:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n(2),i=function(t){function e(e,n,r){var i=t.call(this)||this;return i.parent=e,i.outerValue=n,i.outerIndex=r,i.index=0,i}return r.a(e,t),e.prototype._next=function(t){this.parent.notifyNext(this.outerValue,t,this.outerIndex,this.index++,this)},e.prototype._error=function(t){this.parent.notifyError(t,this),this.unsubscribe()},e.prototype._complete=function(){this.parent.notifyComplete(this),this.unsubscribe()},e}(n(5).a),a=n(58),u=n(12);function c(t,e,n,r,c){if(void 0===c&&(c=new i(t,n,r)),!c.closed)return e instanceof u.a?e.subscribe(c):Object(a.a)(e)(c)}},148:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(126),i=n(60);function a(t){return void 0===t&&(t=Number.POSITIVE_INFINITY),Object(r.a)(i.a,t)}},152:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(83),i=n(153);function a(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return Object(i.a)()(r.a.apply(void 0,t))}},153:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(148);function i(){return Object(r.a)(1)}},171:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(144);function i(t){return function(e){return e.lift(new r.a(t))}}},184:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n(2),i=n(40),a=n(123),u=n(21);function c(t,e){return e?function(n){return n.pipe(c((function(n,r){return Object(a.a)(t(n,r)).pipe(Object(i.a)((function(t,i){return e(n,t,r,i)})))})))}:function(e){return e.lift(new o(t))}}var o=function(){function t(t){this.project=t}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.project))},t}(),s=function(t){function e(e,n){var r=t.call(this,e)||this;return r.project=n,r.hasSubscription=!1,r.hasCompleted=!1,r.index=0,r}return r.a(e,t),e.prototype._next=function(t){this.hasSubscription||this.tryNext(t)},e.prototype.tryNext=function(t){var e,n=this.index++;try{e=this.project(t,n)}catch(r){return void this.destination.error(r)}this.hasSubscription=!0,this._innerSub(e)},e.prototype._innerSub=function(t){var e=new u.a(this),n=this.destination;n.add(e);var r=Object(u.c)(t,e);r!==e&&n.add(r)},e.prototype._complete=function(){this.hasCompleted=!0,this.hasSubscription||this.destination.complete(),this.unsubscribe()},e.prototype.notifyNext=function(t){this.destination.next(t)},e.prototype.notifyError=function(t){this.destination.error(t)},e.prototype.notifyComplete=function(){this.hasSubscription=!1,this.hasCompleted&&this.destination.complete()},e}(u.b)},185:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(152),i=n(57);function a(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=t[t.length-1];return Object(i.a)(n)?(t.pop(),function(e){return Object(r.a)(t,e,n)}):function(e){return Object(r.a)(t,e)}}},220:function(t,e,n){},350:function(t,e,n){"use strict";n.r(e);var r=n(18),i=n.n(r),a=n(127),u=n(36),c=n(26),o=(n(220),n(0)),s=n.n(o),l=n(120),f=n(30),d=new(n(75).a),p={users:[],shouldFetchAllUsers:!0,usersFilter:[]},h=p,b=function(t){h.shouldFetchAllUsers=t},m={initialState:p,subscribe:function(t){return d.subscribe((function(e){return t(e)}))},currentState:function(){var t;return d.subscribe((function(e){t=e})),t},init:function(){d.next(h)},updateUsers:function(t){h=Object(f.a)(Object(f.a)({},h),{},{users:Object(a.a)(t)}),d.next(h)},updateUsersFilter:function(t){h=Object(f.a)(Object(f.a)({},h),{},{usersFilter:Object(a.a)(t)}),d.next(h)}},v=n(107),y=n(123),j=n(142),O=n(83),E=n(185),x=n(171),w=n(40),S=n(184),g=n(136),N=n(100),I=n(101),U=m;function C(t,e){var n=Object(a.a)(t);return e.username&&(n=n.filter((function(t){return new RegExp(e.username,"i").test(t.username)}))),e.role&&(n=n.filter((function(t){return t.role===e.role}))),e.dateStart&&(n=n.filter((function(t){return new Date(e.dateStart).getTime()<=new Date(t.createdAt).getTime()}))),e.dateEnd&&(n=n.filter((function(t){return new Date(e.dateEnd).getTime()>=new Date(t.createdAt).getTime()}))),n}function _(t,e,n,r){var i={};return t&&(i=Object(f.a)(Object(f.a)({},i),{},{username:t.value})),e&&(i=Object(f.a)(Object(f.a)({},i),{},{role:e.value})),n&&(i=Object(f.a)(Object(f.a)({},i),{},{dateStart:n.value})),r&&(i=Object(f.a)(Object(f.a)({},i),{},{dateEnd:r.value})),i}var F=n(74);e.default=function(){var t=Object(l.a)(["idCartoonUser"]),e=Object(c.a)(t,1)[0],n=Object(o.useState)(U.initialState),r=Object(c.a)(n,2),f=r[0],d=r[1],p=Object(o.useState)("all"),h=Object(c.a)(p,2),m=h[0],T=h[1],A=Object(o.useRef)(),D=Object(o.useRef)(),R=Object(o.useRef)(),k=Object(o.useRef)();return Object(o.useEffect)((function(){document.querySelector(".button-scroll-top").style.display="block";var t,n,r,i=U.subscribe(d);return U.init(),f.shouldFetchAllUsers&&(t=(n=e.idCartoonUser,Object(j.a)(0).pipe(Object(S.a)((function(){return Object(I.a)({url:"/api/users",headers:{authorization:"Bearer ".concat(n)}}).pipe(Object(g.a)("response","message"),Object(N.a)((function(t){return Object(O.a)({error:t})})))})))).subscribe((function(t){if(t.error)F.a.resetUser();else{U.updateUsers(t),b(!1);var e=C(t,_(A.current,D.current,R.current,k.current));U.updateUsersFilter(e)}}))),"filter"===m&&(r=function(t,e,n,r,i){var a=[t,e,n,r].map((function(t){return Object(v.a)(t,"change").pipe(Object(E.a)(""))}));return Object(y.a)(a).pipe(Object(x.a)(),Object(w.a)((function(t){var e=Object(c.a)(t,4),n=e[0],r=e[1],a=e[2],u=e[3],o=_(n.target,r.target,a.target,u.target),s=C(i,o);return 0!==Object.keys(o).length&&U.updateUsersFilter(s),s})))}(A.current,D.current,R.current,k.current,f.users).subscribe()),function(){i.unsubscribe(),t&&t.unsubscribe(),r&&r.unsubscribe()}}),[f.shouldFetchAllUsers,f.users,e.idCartoonUser,m]),s.a.createElement("div",{className:"container-admin-session"},s.a.createElement("div",{style:{display:"flex",justifyContent:"center",margin:"1rem"}},s.a.createElement("select",{defaultValue:"all",onChange:function(t){"all"===t.target.value&&b(!0),T(t.target.value)}},s.a.createElement("option",{value:"all"},"Show all"),s.a.createElement("option",{value:"filter"},"Filter"))),"filter"===m&&s.a.createElement("div",{className:"filter-section"},s.a.createElement("div",{className:"filter-bar-controller"},s.a.createElement("div",{className:"m-1"},s.a.createElement("label",null,"Username: "),s.a.createElement("input",{type:"text",ref:A})),s.a.createElement("div",{className:"m-1"},s.a.createElement("label",null,"Role: "),s.a.createElement("select",{ref:D},s.a.createElement("option",{value:""},"All"),s.a.createElement("option",{value:"Admin"},"Admin"),s.a.createElement("option",{value:"User"},"User"))),s.a.createElement("div",{className:"m-1"},s.a.createElement("label",null,"Date start: "),s.a.createElement("input",{type:"Date",ref:R})),s.a.createElement("div",{className:"m-1"},s.a.createElement("label",null,"Date end: "),s.a.createElement("input",{type:"Date",ref:k})))),s.a.createElement("table",{className:"table-user-session"},s.a.createElement("thead",null,s.a.createElement("tr",null,s.a.createElement("th",null,"Email"),s.a.createElement("th",null,"Username"),s.a.createElement("th",null,"Role"),s.a.createElement("th",null,"CreatedAt"),s.a.createElement("th",null,"Control"))),"all"===m&&f.users&&f.users.map((function(t,n){return s.a.createElement("tbody",{key:n},s.a.createElement("tr",null,s.a.createElement("td",null,t.email),s.a.createElement("td",null,t.username),s.a.createElement("td",null,t.role),s.a.createElement("td",null,new Date(t.createdAt).toUTCString()),t&&"User"===t.role&&s.a.createElement("td",null,s.a.createElement("button",{onClick:Object(u.a)(i.a.mark((function r(){var u;return i.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,u=Object(a.a)(f.users),r.next=4,fetch("/api/users/".concat(t._id),{method:"DELETE",headers:{authorization:"Bearer ".concat(e.idCartoonUser)}});case 4:u.splice(n,1),U.updateUsers(u),b(!0),r.next=11;break;case 9:r.prev=9,r.t0=r.catch(0);case 11:case"end":return r.stop()}}),r,null,[[0,9]])})))},"Delete"))))})),"filter"===m&&f.usersFilter&&f.usersFilter.map((function(t,n){return s.a.createElement("tbody",{key:n},s.a.createElement("tr",null,s.a.createElement("td",null,t.email),s.a.createElement("td",null,t.username),s.a.createElement("td",null,t.role),s.a.createElement("td",null,new Date(t.createdAt).toUTCString()),t&&"User"===t.role&&s.a.createElement("td",null,s.a.createElement("button",{onClick:Object(u.a)(i.a.mark((function n(){var r,u,c;return i.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,r=Object(a.a)(f.users),n.next=4,fetch("/api/users/".concat(t._id),{method:"DELETE",headers:{authorization:"Bearer ".concat(e.idCartoonUser)}});case 4:b(!0),u=_(A.current,D.current,R.current,k.current),c=C(r,u),U.updateUsersFilter(c),n.next=12;break;case 10:n.prev=10,n.t0=n.catch(0);case 12:case"end":return n.stop()}}),n,null,[[0,10]])})))},"Delete"))))}))))}}}]);
//# sourceMappingURL=17.d5559b06.chunk.js.map