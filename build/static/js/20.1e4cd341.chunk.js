(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[20],{125:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(41);function i(t){return!Object(r.a)(t)&&t-parseFloat(t)+1>=0}},126:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(2),i=n(40),o=n(123),c=n(21);function a(t,e,n){return void 0===n&&(n=Number.POSITIVE_INFINITY),"function"===typeof e?function(r){return r.pipe(a((function(n,r){return Object(o.a)(t(n,r)).pipe(Object(i.a)((function(t,i){return e(n,t,r,i)})))}),n))}:("number"===typeof e&&(n=e),function(e){return e.lift(new u(t,n))})}var u=function(){function t(t,e){void 0===e&&(e=Number.POSITIVE_INFINITY),this.project=t,this.concurrent=e}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.project,this.concurrent))},t}(),s=function(t){function e(e,n,r){void 0===r&&(r=Number.POSITIVE_INFINITY);var i=t.call(this,e)||this;return i.project=n,i.concurrent=r,i.hasCompleted=!1,i.buffer=[],i.active=0,i.index=0,i}return r.a(e,t),e.prototype._next=function(t){this.active<this.concurrent?this._tryNext(t):this.buffer.push(t)},e.prototype._tryNext=function(t){var e,n=this.index++;try{e=this.project(t,n)}catch(r){return void this.destination.error(r)}this.active++,this._innerSub(e)},e.prototype._innerSub=function(t){var e=new c.a(this),n=this.destination;n.add(e);var r=Object(c.c)(t,e);r!==e&&n.add(r)},e.prototype._complete=function(){this.hasCompleted=!0,0===this.active&&0===this.buffer.length&&this.destination.complete(),this.unsubscribe()},e.prototype.notifyNext=function(t){this.destination.next(t)},e.prototype.notifyComplete=function(){var t=this.buffer;this.active--,t.length>0?this._next(t.shift()):0===this.active&&this.hasCompleted&&this.destination.complete()},e}(c.b)},127:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var r=n(54);var i=n(59);function o(t){return function(t){if(Array.isArray(t))return Object(r.a)(t)}(t)||function(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||Object(i.a)(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},128:function(t,e,n){"use strict";function r(){}n.d(e,"a",(function(){return r}))},136:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(40);function i(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=t.length;if(0===n)throw new Error("list of properties cannot be empty.");return function(e){return Object(r.a)(o(t,n))(e)}}function o(t,e){return function(n){for(var r=n,i=0;i<e;i++){var o=null!=r?r[t[i]]:void 0;if(void 0===o)return;r=o}return r}}},137:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(2),i=n(40),o=n(123),c=n(21);function a(t,e){return"function"===typeof e?function(n){return n.pipe(a((function(n,r){return Object(o.a)(t(n,r)).pipe(Object(i.a)((function(t,i){return e(n,t,r,i)})))})))}:function(e){return e.lift(new u(t))}}var u=function(){function t(t){this.project=t}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.project))},t}(),s=function(t){function e(e,n){var r=t.call(this,e)||this;return r.project=n,r.index=0,r}return r.a(e,t),e.prototype._next=function(t){var e,n=this.index++;try{e=this.project(t,n)}catch(r){return void this.destination.error(r)}this._innerSub(e)},e.prototype._innerSub=function(t){var e=this.innerSubscription;e&&e.unsubscribe();var n=new c.a(this),r=this.destination;r.add(n),this.innerSubscription=Object(c.c)(t,n),this.innerSubscription!==n&&r.add(this.innerSubscription)},e.prototype._complete=function(){var e=this.innerSubscription;e&&!e.closed||t.prototype._complete.call(this),this.unsubscribe()},e.prototype._unsubscribe=function(){this.innerSubscription=void 0},e.prototype.notifyComplete=function(){this.innerSubscription=void 0,this.isStopped&&t.prototype._complete.call(this)},e.prototype.notifyNext=function(t){this.destination.next(t)},e}(c.b)},142:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(12),i=n(53),o=n(125),c=n(57);function a(t,e,n){void 0===t&&(t=0);var a=-1;return Object(o.a)(e)?a=Number(e)<1?1:Number(e):Object(c.a)(e)&&(n=e),Object(c.a)(n)||(n=i.a),new r.a((function(e){var r=Object(o.a)(t)?t:+t-n.now();return n.schedule(u,r,{index:0,period:a,subscriber:e})}))}function u(t){var e=t.index,n=t.period,r=t.subscriber;if(r.next(e),!r.closed){if(-1===n)return r.complete();t.index=e+1,this.schedule(t,n)}}},148:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var r=n(126),i=n(60);function o(t){return void 0===t&&(t=Number.POSITIVE_INFINITY),Object(r.a)(i.a,t)}},149:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(2),i=n(5),o=n(128),c=n(27);function a(t,e,n){return function(r){return r.lift(new u(t,e,n))}}var u=function(){function t(t,e,n){this.nextOrObserver=t,this.error=e,this.complete=n}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.nextOrObserver,this.error,this.complete))},t}(),s=function(t){function e(e,n,r,i){var a=t.call(this,e)||this;return a._tapNext=o.a,a._tapError=o.a,a._tapComplete=o.a,a._tapError=r||o.a,a._tapComplete=i||o.a,Object(c.a)(n)?(a._context=a,a._tapNext=n):n&&(a._context=n,a._tapNext=n.next||o.a,a._tapError=n.error||o.a,a._tapComplete=n.complete||o.a),a}return r.a(e,t),e.prototype._next=function(t){try{this._tapNext.call(this._context,t)}catch(e){return void this.destination.error(e)}this.destination.next(t)},e.prototype._error=function(t){try{this._tapError.call(this._context,t)}catch(t){return void this.destination.error(t)}this.destination.error(t)},e.prototype._complete=function(){try{this._tapComplete.call(this._context)}catch(t){return void this.destination.error(t)}return this.destination.complete()},e}(i.a)},153:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(148);function i(){return Object(r.a)(1)}},156:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var r=n(2),i=n(5);function o(t){return void 0===t&&(t=-1),function(e){return e.lift(new c(t,e))}}var c=function(){function t(t,e){this.count=t,this.source=e}return t.prototype.call=function(t,e){return e.subscribe(new a(t,this.count,this.source))},t}(),a=function(t){function e(e,n,r){var i=t.call(this,e)||this;return i.count=n,i.source=r,i}return r.a(e,t),e.prototype.error=function(e){if(!this.isStopped){var n=this.source,r=this.count;if(0===r)return t.prototype.error.call(this,e);r>-1&&(this.count=r-1),n.subscribe(this._unsubscribeAndRecycle())}},e}(i.a)},168:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var r=n(2),i=n(5);function o(t,e){return void 0===e&&(e=!1),function(n){return n.lift(new c(t,e))}}var c=function(){function t(t,e){this.predicate=t,this.inclusive=e}return t.prototype.call=function(t,e){return e.subscribe(new a(t,this.predicate,this.inclusive))},t}(),a=function(t){function e(e,n,r){var i=t.call(this,e)||this;return i.predicate=n,i.inclusive=r,i.index=0,i}return r.a(e,t),e.prototype._next=function(t){var e,n=this.destination;try{e=this.predicate(t,this.index++)}catch(r){return void n.error(r)}this.nextOrComplete(t,e)},e.prototype.nextOrComplete=function(t,e){var n=this.destination;Boolean(e)?n.next(t):(this.inclusive&&n.next(t),n.complete())},e}(i.a)},169:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(137);function i(t,e){return e?Object(r.a)((function(){return t}),e):Object(r.a)((function(){return t}))}},260:function(t,e,n){},261:function(t,e,n){},311:function(t,e,n){"use strict";n.r(e);var r=n(127),i=n(26),o=(n(260),n(0)),c=n.n(o),a=n(83),u=n(142),s=n(123),p=n(101),f=n(136),d=n(156),l=n(100),h=n(168),b=n(149),m=n(169),v=n(153),y=(n(261),n(13)),j=function(t){var e=t.title,n=t.aired,r=t.episodes,i=t.score,o=t.images,a=t.index,u=t.malId;return c.a.createElement(y.b,{title:e,to:"/anime/".concat(u,"-").concat(e.replace(/[ /%^&*():.$,]/g,"-").toLocaleLowerCase()),className:"random-anime-item",style:{width:a<3?"32%":"23%",height:a<3?"300px":"200px"}},c.a.createElement("img",{src:o.webp.large_image_url,alt:"",loading:"lazy"}),c.a.createElement("div",{className:"random-anime-display"},c.a.createElement("div",null,i&&c.a.createElement("span",{className:"random-anime-score"},i,"/10"),r&&c.a.createElement("span",{style:{margin:i?null:"0"},className:"random-anime-episodes"},r>=2?"".concat(r," episodes"):"one shot")),c.a.createElement("h1",{className:"random-anime-title"},e),c.a.createElement("div",{className:"random-anime-info"},c.a.createElement("div",{className:"random-anime-aired"},n.string))))},O=n(30),x=n(75),_={randomAnimeList:[],isLoading:!0},N=new x.a(_),S=_,w={subscribe:function(t){return N.subscribe(t)},currentState:function(){var t;return N.subscribe((function(e){return t=e})),t||_},updateData:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:_;S=Object(O.a)(Object(O.a)({},S),t),N.next(S)}},E=n(119);e.default=function(){var t=Object(o.useState)(w.currentState()),e=Object(i.a)(t,2),n=e[0],y=e[1];return Object(o.useEffect)((function(){var t=w.subscribe(y);return function(){t.unsubscribe()}}),[]),Object(o.useEffect)((function(){var t=Object(p.a)("https://api.jikan.moe/v4/random/anime").pipe(Object(f.a)("response","data"),Object(d.a)(6),Object(l.a)((function(t){return Object(a.a)({error:t})}))),e=Object(u.a)(0).pipe(Object(h.a)((function(){return 7!==w.currentState().randomAnimeList.length})),Object(b.a)((function(){w.updateData({randomAnimeList:[]})})),Object(m.a)(Object(s.a)([t,t,t,t,t,t,t]).pipe(Object(v.a)()))).subscribe((function(t){w.updateData({randomAnimeList:[].concat(Object(r.a)(w.currentState().randomAnimeList),[t]),isLoading:!1})}));return function(){e.unsubscribe()}}),[]),c.a.createElement("div",{className:"random-anime-list"},n.isLoading&&c.a.createElement(E.a,{color:"secondary",size:"5rem"}),n.randomAnimeList.map((function(t,e){var n=t.title,r=(t.duration,t.aired),i=t.episodes,o=t.score,a=(t.rating,t.images),u=t.mal_id;return c.a.createElement(j,{key:e,title:n,aired:r,episodes:i,score:o,images:a,malId:u,index:e})})))}}}]);
//# sourceMappingURL=20.1e4cd341.chunk.js.map