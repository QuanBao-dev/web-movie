(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[21,66],{124:function(t,e,n){"use strict";n.d(e,"a",(function(){return o})),n.d(e,"b",(function(){return i}));var r=n(12),o=new r.a((function(t){return t.complete()}));function i(t){return t?function(t){return new r.a((function(e){return t.schedule((function(){return e.complete()}))}))}(t):o}},125:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var r=n(41);function o(t){return!Object(r.a)(t)&&t-parseFloat(t)+1>=0}},126:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(2),o=n(40),i=n(123),c=n(21);function a(t,e,n){return void 0===n&&(n=Number.POSITIVE_INFINITY),"function"===typeof e?function(r){return r.pipe(a((function(n,r){return Object(i.a)(t(n,r)).pipe(Object(o.a)((function(t,o){return e(n,t,r,o)})))}),n))}:("number"===typeof e&&(n=e),function(e){return e.lift(new u(t,n))})}var u=function(){function t(t,e){void 0===e&&(e=Number.POSITIVE_INFINITY),this.project=t,this.concurrent=e}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.project,this.concurrent))},t}(),s=function(t){function e(e,n,r){void 0===r&&(r=Number.POSITIVE_INFINITY);var o=t.call(this,e)||this;return o.project=n,o.concurrent=r,o.hasCompleted=!1,o.buffer=[],o.active=0,o.index=0,o}return r.a(e,t),e.prototype._next=function(t){this.active<this.concurrent?this._tryNext(t):this.buffer.push(t)},e.prototype._tryNext=function(t){var e,n=this.index++;try{e=this.project(t,n)}catch(r){return void this.destination.error(r)}this.active++,this._innerSub(e)},e.prototype._innerSub=function(t){var e=new c.a(this),n=this.destination;n.add(e);var r=Object(c.c)(t,e);r!==e&&n.add(r)},e.prototype._complete=function(){this.hasCompleted=!0,0===this.active&&0===this.buffer.length&&this.destination.complete(),this.unsubscribe()},e.prototype.notifyNext=function(t){this.destination.next(t)},e.prototype.notifyComplete=function(){var t=this.buffer;this.active--,t.length>0?this._next(t.shift()):0===this.active&&this.hasCompleted&&this.destination.complete()},e}(c.b)},127:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(54);var o=n(59);function i(t){return function(t){if(Array.isArray(t))return Object(r.a)(t)}(t)||function(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||Object(o.a)(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},128:function(t,e,n){"use strict";function r(){}n.d(e,"a",(function(){return r}))},132:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n(12),o=n(123),i=n(124);function c(t){return new r.a((function(e){var n;try{n=t()}catch(r){return void e.error(r)}return(n?Object(o.a)(n):Object(i.b)()).subscribe(e)}))}},136:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var r=n(40);function o(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=t.length;if(0===n)throw new Error("list of properties cannot be empty.");return function(e){return Object(r.a)(i(t,n))(e)}}function i(t,e){return function(n){for(var r=n,o=0;o<e;o++){var i=null!=r?r[t[o]]:void 0;if(void 0===i)return;r=i}return r}}},140:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(2),o=n(5);function i(t,e){return function(n){return n.lift(new c(t,e))}}var c=function(){function t(t,e){this.predicate=t,this.thisArg=e}return t.prototype.call=function(t,e){return e.subscribe(new a(t,this.predicate,this.thisArg))},t}(),a=function(t){function e(e,n,r){var o=t.call(this,e)||this;return o.predicate=n,o.thisArg=r,o.count=0,o}return r.a(e,t),e.prototype._next=function(t){var e;try{e=this.predicate.call(this.thisArg,t,this.count++)}catch(n){return void this.destination.error(n)}e&&this.destination.next(t)},e}(o.a)},142:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(12),o=n(53),i=n(125),c=n(57);function a(t,e,n){void 0===t&&(t=0);var a=-1;return Object(i.a)(e)?a=Number(e)<1?1:Number(e):Object(c.a)(e)&&(n=e),Object(c.a)(n)||(n=o.a),new r.a((function(e){var r=Object(i.a)(t)?t:+t-n.now();return n.schedule(u,r,{index:0,period:a,subscriber:e})}))}function u(t){var e=t.index,n=t.period,r=t.subscriber;if(r.next(e),!r.closed){if(-1===n)return r.complete();t.index=e+1,this.schedule(t,n)}}},149:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(2),o=n(5),i=n(128),c=n(27);function a(t,e,n){return function(r){return r.lift(new u(t,e,n))}}var u=function(){function t(t,e,n){this.nextOrObserver=t,this.error=e,this.complete=n}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.nextOrObserver,this.error,this.complete))},t}(),s=function(t){function e(e,n,r,o){var a=t.call(this,e)||this;return a._tapNext=i.a,a._tapError=i.a,a._tapComplete=i.a,a._tapError=r||i.a,a._tapComplete=o||i.a,Object(c.a)(n)?(a._context=a,a._tapNext=n):n&&(a._context=n,a._tapNext=n.next||i.a,a._tapError=n.error||i.a,a._tapComplete=n.complete||i.a),a}return r.a(e,t),e.prototype._next=function(t){try{this._tapNext.call(this._context,t)}catch(e){return void this.destination.error(e)}this.destination.next(t)},e.prototype._error=function(t){try{this._tapError.call(this._context,t)}catch(t){return void this.destination.error(t)}this.destination.error(t)},e.prototype._complete=function(){try{this._tapComplete.call(this._context)}catch(t){return void this.destination.error(t)}return this.destination.complete()},e}(o.a)},150:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n(2),o=n(5),i=n(53);function c(t,e){return void 0===e&&(e=i.a),function(n){return n.lift(new a(t,e))}}var a=function(){function t(t,e){this.dueTime=t,this.scheduler=e}return t.prototype.call=function(t,e){return e.subscribe(new u(t,this.dueTime,this.scheduler))},t}(),u=function(t){function e(e,n,r){var o=t.call(this,e)||this;return o.dueTime=n,o.scheduler=r,o.debouncedSubscription=null,o.lastValue=null,o.hasValue=!1,o}return r.a(e,t),e.prototype._next=function(t){this.clearDebounce(),this.lastValue=t,this.hasValue=!0,this.add(this.debouncedSubscription=this.scheduler.schedule(s,this.dueTime,this))},e.prototype._complete=function(){this.debouncedNext(),this.destination.complete()},e.prototype.debouncedNext=function(){if(this.clearDebounce(),this.hasValue){var t=this.lastValue;this.lastValue=null,this.hasValue=!1,this.destination.next(t)}},e.prototype.clearDebounce=function(){var t=this.debouncedSubscription;null!==t&&(this.remove(t),t.unsubscribe(),this.debouncedSubscription=null)},e}(o.a);function s(t){t.debouncedNext()}},154:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(132),o=n(124);function i(t,e,n){return void 0===e&&(e=o.a),void 0===n&&(n=o.a),Object(r.a)((function(){return t()?e:n}))}},156:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(2),o=n(5);function i(t){return void 0===t&&(t=-1),function(e){return e.lift(new c(t,e))}}var c=function(){function t(t,e){this.count=t,this.source=e}return t.prototype.call=function(t,e){return e.subscribe(new a(t,this.count,this.source))},t}(),a=function(t){function e(e,n,r){var o=t.call(this,e)||this;return o.count=n,o.source=r,o}return r.a(e,t),e.prototype.error=function(e){if(!this.isStopped){var n=this.source,r=this.count;if(0===r)return t.prototype.error.call(this,e);r>-1&&(this.count=r-1),n.subscribe(this._unsubscribeAndRecycle())}},e}(o.a)},159:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var r=n(126);function o(t,e,n){return void 0===n&&(n=Number.POSITIVE_INFINITY),"function"===typeof e?Object(r.a)((function(){return t}),e,n):("number"===typeof e&&(n=e),Object(r.a)((function(){return t}),n))}},184:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(2),o=n(40),i=n(123),c=n(21);function a(t,e){return e?function(n){return n.pipe(a((function(n,r){return Object(i.a)(t(n,r)).pipe(Object(o.a)((function(t,o){return e(n,t,r,o)})))})))}:function(e){return e.lift(new u(t))}}var u=function(){function t(t){this.project=t}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.project))},t}(),s=function(t){function e(e,n){var r=t.call(this,e)||this;return r.project=n,r.hasSubscription=!1,r.hasCompleted=!1,r.index=0,r}return r.a(e,t),e.prototype._next=function(t){this.hasSubscription||this.tryNext(t)},e.prototype.tryNext=function(t){var e,n=this.index++;try{e=this.project(t,n)}catch(r){return void this.destination.error(r)}this.hasSubscription=!0,this._innerSub(e)},e.prototype._innerSub=function(t){var e=new c.a(this),n=this.destination;n.add(e);var r=Object(c.c)(t,e);r!==e&&n.add(r)},e.prototype._complete=function(){this.hasCompleted=!0,this.hasSubscription||this.destination.complete(),this.unsubscribe()},e.prototype.notifyNext=function(t){this.destination.next(t)},e.prototype.notifyError=function(t){this.destination.error(t)},e.prototype.notifyComplete=function(){this.hasSubscription=!1,this.hasCompleted&&this.destination.complete()},e}(c.b)},267:function(t,e,n){},307:function(t,e,n){"use strict";n.r(e);var r=n(26),o=(n(267),n(7)),i=n(119),c=n(0),a=n.n(c),u=n(142),s=n(154),p=n(107),l=n(83),h=n(101),f=n(159),d=n(140),b=n(149),v=n(150),m=n(184),y=n(136),S=n(156),T=n(100),g=n(30),O=n(75),j={screenWidth:null,dataTopMovie:[],pageTopMovieOnDestroy:null,isStopFetchTopMovie:!1,pageSplitTopMovie:1,allowFetchIncreasePageTopMovie:!1,pageTopMovie:1,toggleFetchMode:"rank",positionScrollTop:0},M=new O.a(j),w=j,x={initialState:j,subscribe:function(t){return M.subscribe((function(e){return t(e)}))},currentState:function(){var t;return M.subscribe((function(e){t=e})),t||j},init:function(){w=Object(g.a)(Object(g.a)({},w),{},{screenWidth:window.innerWidth}),M.next(w)},updateData:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:j;w=Object(g.a)(Object(g.a)({},w),t),M.next(w)},updateDataQuick:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:j,e=Object.keys(t);e.forEach((function(e){w[e]=t[e]}))}},_=n(127),N=function(){return function(){var t,e=document.querySelector(".top-anime-list-container");return e&&(t=function(t){return Object(u.a)(0).pipe(Object(f.a)(Object(s.a)((function(){return window.innerWidth>770}),Object(p.a)(x.currentState().screenWidth>1510?t:window,"scroll").pipe(Object(d.a)((function(){return x.currentState().screenWidth>1510?t.scrollTop-(t.scrollHeight-5e3)>0:document.body.scrollHeight-(window.scrollY+2e3)<0})),Object(b.a)((function(){8+5*(x.currentState().pageSplitTopMovie-1)<=x.currentState().dataTopMovie.length&&x.updateData({pageSplitTopMovie:x.currentState().pageSplitTopMovie+1})}))),Object(p.a)(x.currentState().screenWidth>1510?t:window,"scroll").pipe(Object(v.a)(500),Object(d.a)((function(){return x.currentState().screenWidth>1510?t.scrollTop-(t.scrollHeight-5e3)>0:document.body.scrollHeight-(window.scrollY+2e3)<0})),Object(b.a)((function(){8+5*(x.currentState().pageSplitTopMovie-1)<=x.currentState().dataTopMovie.length&&x.updateData({pageSplitTopMovie:x.currentState().pageSplitTopMovie+1})}))))))}(e).subscribe((function(){8+8*(x.currentState().pageSplitTopMovie-1)>x.currentState().dataTopMovie.length&&x.updateData({pageTopMovie:x.currentState().dataTopMovie.length/25+1})})),x.currentState().isStopFetchTopMovie&&t&&t.unsubscribe()),function(){t&&t.unsubscribe()}}},I=function(t){return function(){var e;return x.currentState().pageTopMovieOnDestroy===t.pageTopMovie||x.currentState().isStopFetchTopMovie||(e=Object(u.a)(0).pipe(Object(b.a)((function(){return x.updateData({allowFetchIncreasePageTopMovie:!1})})),Object(m.a)((function(){return Object(h.a)({url:"rank"===x.currentState().toggleFetchMode?"https://api.jikan.moe/v4/top/anime?page=".concat(x.currentState().pageTopMovie):"https://api.jikan.moe/v4/anime?order_by=".concat(x.currentState().toggleFetchMode,"&page=").concat(x.currentState().pageTopMovie,"&sort=desc")}).pipe(Object(y.a)("response","data"),Object(b.a)((function(){x.updateData({allowFetchIncreasePageTopMovie:!0}),x.updateDataQuick({pageTopMovieOnDestroy:x.currentState().pageTopMovie})})),Object(S.a)(5),Object(T.a)((function(t){return x.updateData({isStopFetchTopMovie:!0}),x.updateData({allowFetchIncreasePageTopMovie:!1}),Object(l.a)(x.currentState().dataTopMovie)})))}))).subscribe((function(t){var e=[].concat(Object(_.a)(x.currentState().dataTopMovie),Object(_.a)(t));e.length/25+1!==parseInt(e.length/25+1)&&x.updateData({isStopFetchTopMovie:!0}),x.updateData({dataTopMovie:e})}))),function(){e&&e.unsubscribe()}}},E=function(t){Object(c.useEffect)(function(t){return function(){var e=x.subscribe(t);return x.init(),x.currentState().screenWidth>697&&setTimeout((function(){document.querySelector(".top-anime-list-container")&&document.querySelector(".top-anime-list-container").scroll({top:x.currentState().positionScrollTop})}),10),0===x.currentState().dataTopMovie.length&&(x.updateDataQuick({pageTopMovieOnDestroy:null}),x.updateData({isStopFetchTopMovie:!1})),function(){e.unsubscribe(),x.currentState().screenWidth>697&&x.updateData({positionScrollTop:document.querySelector(".top-anime-list-container").scrollTop})}}}(t),[])},F=Object(o.a)((function(){return Promise.all([n.e(0),n.e(47)]).then(n.bind(null,342))}));e.default=function(){var t=Object(c.useState)(x.currentState()),e=Object(r.a)(t,2),n=e[0],o=e[1];return E(o),function(t){Object(c.useEffect)(N(),[t.allowFetchIncreasePageTopMovie,t.pageTopMovie,t.screenWidth])}(n),function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:x.currentState();Object(c.useEffect)(I(t),[t.pageTopMovie,t.toggleFetchMode])}(n),a.a.createElement("div",{className:"top-anime-list-container",onScroll:function(t){var e=document.querySelector(".container-header-top-anime");0===t.target.scrollTop?e.style.boxShadow="none":e.style.boxShadow="0 0 10px 1px black"}},a.a.createElement("div",{className:"container-header-top-anime"},a.a.createElement("h1",null,"Top Anime"),a.a.createElement("select",{defaultValue:n.toggleFetchMode,className:"select-top-anime",onChange:function(t){document.querySelector(".top-anime-list-container").scroll({top:0}),x.updateData({toggleFetchMode:t.target.value,pageTopMovieOnDestroy:null,isStopFetchTopMovie:!1,pageSplitTopMovie:1,allowFetchIncreasePageTopMovie:!1,pageTopMovie:1,dataTopMovie:[]})}},a.a.createElement("option",{value:"score"},"Score"),a.a.createElement("option",{value:"popularity"},"Popularity"),a.a.createElement("option",{value:"favorites"},"Favorite"),a.a.createElement("option",{value:"rank"},"Rank"))," "),a.a.createElement("ul",{className:"top-anime-list"},n.dataTopMovie.slice(0,8+8*(n.pageSplitTopMovie-1)).map((function(t,e){return a.a.createElement(F,{movie:t,key:e,lazy:1===n.pageSplitTopMovie})})),a.a.createElement("div",{style:{display:n.isStopFetchTopMovie?"none":"block",height:"70px",width:"100%"}},a.a.createElement(i.a,{color:"secondary"}))))}}}]);
//# sourceMappingURL=21.5560c4e1.chunk.js.map