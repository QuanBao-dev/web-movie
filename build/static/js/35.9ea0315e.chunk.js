(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[35],{125:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(41);function i(t){return!Object(r.a)(t)&&t-parseFloat(t)+1>=0}},136:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(40);function i(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=t.length;if(0===n)throw new Error("list of properties cannot be empty.");return function(e){return Object(r.a)(c(t,n))(e)}}function c(t,e){return function(n){for(var r=n,i=0;i<e;i++){var c=null!=r?r[t[i]]:void 0;if(void 0===c)return;r=c}return r}}},137:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(2),i=n(40),c=n(123),u=n(21);function a(t,e){return"function"===typeof e?function(n){return n.pipe(a((function(n,r){return Object(c.a)(t(n,r)).pipe(Object(i.a)((function(t,i){return e(n,t,r,i)})))})))}:function(e){return e.lift(new o(t))}}var o=function(){function t(t){this.project=t}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.project))},t}(),s=function(t){function e(e,n){var r=t.call(this,e)||this;return r.project=n,r.index=0,r}return r.a(e,t),e.prototype._next=function(t){var e,n=this.index++;try{e=this.project(t,n)}catch(r){return void this.destination.error(r)}this._innerSub(e)},e.prototype._innerSub=function(t){var e=this.innerSubscription;e&&e.unsubscribe();var n=new u.a(this),r=this.destination;r.add(n),this.innerSubscription=Object(u.c)(t,n),this.innerSubscription!==n&&r.add(this.innerSubscription)},e.prototype._complete=function(){var e=this.innerSubscription;e&&!e.closed||t.prototype._complete.call(this),this.unsubscribe()},e.prototype._unsubscribe=function(){this.innerSubscription=void 0},e.prototype.notifyComplete=function(){this.innerSubscription=void 0,this.isStopped&&t.prototype._complete.call(this)},e.prototype.notifyNext=function(t){this.destination.next(t)},e}(u.b)},142:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(12),i=n(53),c=n(125),u=n(57);function a(t,e,n){void 0===t&&(t=0);var a=-1;return Object(c.a)(e)?a=Number(e)<1?1:Number(e):Object(u.a)(e)&&(n=e),Object(u.a)(n)||(n=i.a),new r.a((function(e){var r=Object(c.a)(t)?t:+t-n.now();return n.schedule(o,r,{index:0,period:a,subscriber:e})}))}function o(t){var e=t.index,n=t.period,r=t.subscriber;if(r.next(e),!r.closed){if(-1===n)return r.complete();t.index=e+1,this.schedule(t,n)}}},156:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n(2),i=n(5);function c(t){return void 0===t&&(t=-1),function(e){return e.lift(new u(t,e))}}var u=function(){function t(t,e){this.count=t,this.source=e}return t.prototype.call=function(t,e){return e.subscribe(new a(t,this.count,this.source))},t}(),a=function(t){function e(e,n,r){var i=t.call(this,e)||this;return i.count=n,i.source=r,i}return r.a(e,t),e.prototype.error=function(e){if(!this.isStopped){var n=this.source,r=this.count;if(0===r)return t.prototype.error.call(this,e);r>-1&&(this.count=r-1),n.subscribe(this._unsubscribeAndRecycle())}},e}(i.a)},158:function(t,e,n){"use strict";n.d(e,"c",(function(){return g})),n.d(e,"b",(function(){return j})),n.d(e,"a",(function(){return O}));var r=n(142),i=n(83),c=n(123),u=n(101),a=n(169),o=n(136),s=n(156),b=n(100),p=n(137),f=n(30),d=n(75),v={currentPageBoxMovie:1,currentPageUpdatedMovie:1,updatedMovie:[],boxMovie:[],lastPageUpdatedMovie:1,lastPageBoxMovie:1,subNavToggle:null,triggerFetch:!1},l=new d.a(v),h=v,g={initialState:v,subscribe:function(t){return l.subscribe((function(e){return t(e)}))},currentState:function(){var t;return l.subscribe((function(e){t=e})),t||v},init:function(){l.next(h)},updateData:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v;h=Object(f.a)(Object(f.a)({},h),t),l.next(h)},updateDataQuick:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v,e=Object.keys(t);e.forEach((function(e){h[e]=t[e]}))}},j=function(){return Object(r.a)(0).pipe(Object(a.a)(Object(u.a)({url:"/api/movies/latest?page="+g.currentState().currentPageUpdatedMovie}).pipe(Object(o.a)("response","message"),Object(s.a)(20),Object(b.a)((function(){return Object(i.a)([])})))))},O=function(t){return Object(r.a)(0).pipe(Object(p.a)((function(){return Object(u.a)({url:"/api/movies/box?page="+g.currentState().currentPageBoxMovie,headers:{authorization:"Bearer ".concat(t)}}).pipe(Object(o.a)("response","message"),Object(s.a)(20),Object(b.a)((function(t){return Object(c.a)([])})))})))}},169:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(137);function i(t,e){return e?Object(r.a)((function(){return t}),e):Object(r.a)((function(){return t}))}},264:function(t,e,n){},314:function(t,e,n){"use strict";n.r(e);var r=n(26),i=(n(264),n(7)),c=n(0),u=n.n(c),a=n(120),o=n(158),s=n(22),b=n(44),p=function(t){Object(c.useEffect)(function(t){return function(){var e=o.c.subscribe(t);return o.c.init(),function(){e.unsubscribe()}}}(t),[])},f=Object(i.a)((function(){return n.e(55).then(n.bind(null,341))}),{fallback:u.a.createElement("div",null,u.a.createElement("i",{className:"fas fa-spinner fa-9x fa-spin"}))});function d(t){var e=t.subNavToggle,n=t.setSubNavToggle,r=t.user;return u.a.createElement("div",{className:"sub-nav-bar"},u.a.createElement("h1",{className:"sub-nav-item".concat(0===e?" sub-nav-active":""),onClick:function(){n(0),o.c.updateDataQuick({subNavToggle:0})}},"Updated Anime"),r&&u.a.createElement("h1",{className:"sub-nav-item".concat(1===e?" sub-nav-active":""),onClick:function(){n(1),o.c.updateDataQuick({subNavToggle:1})}},"Box Anime"))}e.default=function(){var t=Object(c.useState)(o.c.currentState()),e=Object(r.a)(t,2),n=e[0],i=e[1],v=Object(c.useState)(!0),l=Object(r.a)(v,2),h=l[0],g=l[1],j=Object(c.useState)(o.c.currentState().subNavToggle||0),O=Object(r.a)(j,2),m=O[0],S=O[1],x=Object(a.a)(["idCartoonUser"]),y=Object(r.a)(x,1)[0],M=s.b.currentState();return p(i),function(t,e,n,r){Object(c.useEffect)((function(){var t,i;return 0===e&&(n(!0),t=Object(o.b)().subscribe((function(t){var e=t.data,r=t.lastPage;o.c.updateData({updatedMovie:e,lastPageUpdatedMovie:r}),n(!1),b.a.updateIsShowBlockPopUp(!1)}))),1===e&&(n(!0),i=Object(o.a)(r.idCartoonUser).subscribe((function(t){var e=t.data,r=t.lastPage;o.c.updateData({boxMovie:e,lastPageBoxMovie:r}),n(!1),b.a.updateIsShowBlockPopUp(!1)}))),function(){t&&t.unsubscribe(),i&&i.unsubscribe()}}),[e,t.currentPageBoxMovie,t.currentPageUpdatedMovie,t.triggerFetch])}(n,m,g,y),u.a.createElement("div",{style:{paddingBottom:"1.2rem",boxShadow:"0 0 3px 3px rgb(51, 57, 92)",backgroundColor:"#212541",marginBottom:"0.7rem"}},u.a.createElement(d,{subNavToggle:m,setSubNavToggle:S,user:M}),u.a.createElement(f,{updatedMovie:0===m?n.updatedMovie:n.boxMovie,lastPage:0===m?n.lastPageUpdatedMovie:n.lastPageBoxMovie,subNavToggle:m,currentPage:0===m?o.c.currentState().currentPageUpdatedMovie:o.c.currentState().currentPageBoxMovie,isEmpty:h}))}}}]);
//# sourceMappingURL=35.9ea0315e.chunk.js.map