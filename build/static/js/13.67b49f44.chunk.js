(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[13],{124:function(t,e,a){"use strict";a.d(e,"a",(function(){return r})),a.d(e,"b",(function(){return c}));var n=a(12),r=new n.a((function(t){return t.complete()}));function c(t){return t?function(t){return new n.a((function(e){return t.schedule((function(){return e.complete()}))}))}(t):r}},125:function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));var n=a(41);function r(t){return!Object(n.a)(t)&&t-parseFloat(t)+1>=0}},126:function(t,e,a){"use strict";a.d(e,"a",(function(){return o}));var n=a(2),r=a(40),c=a(123),i=a(21);function o(t,e,a){return void 0===a&&(a=Number.POSITIVE_INFINITY),"function"===typeof e?function(n){return n.pipe(o((function(a,n){return Object(c.a)(t(a,n)).pipe(Object(r.a)((function(t,r){return e(a,t,n,r)})))}),a))}:("number"===typeof e&&(a=e),function(e){return e.lift(new u(t,a))})}var u=function(){function t(t,e){void 0===e&&(e=Number.POSITIVE_INFINITY),this.project=t,this.concurrent=e}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.project,this.concurrent))},t}(),s=function(t){function e(e,a,n){void 0===n&&(n=Number.POSITIVE_INFINITY);var r=t.call(this,e)||this;return r.project=a,r.concurrent=n,r.hasCompleted=!1,r.buffer=[],r.active=0,r.index=0,r}return n.a(e,t),e.prototype._next=function(t){this.active<this.concurrent?this._tryNext(t):this.buffer.push(t)},e.prototype._tryNext=function(t){var e,a=this.index++;try{e=this.project(t,a)}catch(n){return void this.destination.error(n)}this.active++,this._innerSub(e)},e.prototype._innerSub=function(t){var e=new i.a(this),a=this.destination;a.add(e);var n=Object(i.c)(t,e);n!==e&&a.add(n)},e.prototype._complete=function(){this.hasCompleted=!0,0===this.active&&0===this.buffer.length&&this.destination.complete(),this.unsubscribe()},e.prototype.notifyNext=function(t){this.destination.next(t)},e.prototype.notifyComplete=function(){var t=this.buffer;this.active--,t.length>0?this._next(t.shift()):0===this.active&&this.hasCompleted&&this.destination.complete()},e}(i.b)},128:function(t,e,a){"use strict";function n(){}a.d(e,"a",(function(){return n}))},129:function(t,e,a){"use strict";var n=a(30),r={},c=new(a(75).a)(r),i=r,o={subscribe:function(t){return c.subscribe((function(e){return t(e)}))},currentState:function(){var t;return c.subscribe((function(e){t=e})),t},updateData:function(t){i=Object(n.a)(Object(n.a)({},i),t),c.next(i)}};e.a=o},131:function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));var n=a(12);function r(t,e){return e?new n.a((function(a){return e.schedule(c,0,{error:t,subscriber:a})})):new n.a((function(e){return e.error(t)}))}function c(t){var e=t.error;t.subscriber.error(e)}},132:function(t,e,a){"use strict";a.d(e,"a",(function(){return i}));var n=a(12),r=a(123),c=a(124);function i(t){return new n.a((function(e){var a;try{a=t()}catch(n){return void e.error(n)}return(a?Object(r.a)(a):Object(c.b)()).subscribe(e)}))}},134:function(t,e,a){"use strict";function n(t){return t instanceof Date&&!isNaN(+t)}a.d(e,"a",(function(){return n}))},136:function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));var n=a(40);function r(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var a=t.length;if(0===a)throw new Error("list of properties cannot be empty.");return function(e){return Object(n.a)(c(t,a))(e)}}function c(t,e){return function(a){for(var n=a,r=0;r<e;r++){var c=null!=n?n[t[r]]:void 0;if(void 0===c)return;n=c}return n}}},140:function(t,e,a){"use strict";a.d(e,"a",(function(){return c}));var n=a(2),r=a(5);function c(t,e){return function(a){return a.lift(new i(t,e))}}var i=function(){function t(t,e){this.predicate=t,this.thisArg=e}return t.prototype.call=function(t,e){return e.subscribe(new o(t,this.predicate,this.thisArg))},t}(),o=function(t){function e(e,a,n){var r=t.call(this,e)||this;return r.predicate=a,r.thisArg=n,r.count=0,r}return n.a(e,t),e.prototype._next=function(t){var e;try{e=this.predicate.call(this.thisArg,t,this.count++)}catch(a){return void this.destination.error(a)}e&&this.destination.next(t)},e}(r.a)},142:function(t,e,a){"use strict";a.d(e,"a",(function(){return o}));var n=a(12),r=a(53),c=a(125),i=a(57);function o(t,e,a){void 0===t&&(t=0);var o=-1;return Object(c.a)(e)?o=Number(e)<1?1:Number(e):Object(i.a)(e)&&(a=e),Object(i.a)(a)||(a=r.a),new n.a((function(e){var n=Object(c.a)(t)?t:+t-a.now();return a.schedule(u,n,{index:0,period:o,subscriber:e})}))}function u(t){var e=t.index,a=t.period,n=t.subscriber;if(n.next(e),!n.closed){if(-1===a)return n.complete();t.index=e+1,this.schedule(t,a)}}},143:function(t,e,a){},148:function(t,e,a){"use strict";a.d(e,"a",(function(){return c}));var n=a(126),r=a(60);function c(t){return void 0===t&&(t=Number.POSITIVE_INFINITY),Object(n.a)(r.a,t)}},149:function(t,e,a){"use strict";a.d(e,"a",(function(){return o}));var n=a(2),r=a(5),c=a(128),i=a(27);function o(t,e,a){return function(n){return n.lift(new u(t,e,a))}}var u=function(){function t(t,e,a){this.nextOrObserver=t,this.error=e,this.complete=a}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.nextOrObserver,this.error,this.complete))},t}(),s=function(t){function e(e,a,n,r){var o=t.call(this,e)||this;return o._tapNext=c.a,o._tapError=c.a,o._tapComplete=c.a,o._tapError=n||c.a,o._tapComplete=r||c.a,Object(i.a)(a)?(o._context=o,o._tapNext=a):a&&(o._context=a,o._tapNext=a.next||c.a,o._tapError=a.error||c.a,o._tapComplete=a.complete||c.a),o}return n.a(e,t),e.prototype._next=function(t){try{this._tapNext.call(this._context,t)}catch(e){return void this.destination.error(e)}this.destination.next(t)},e.prototype._error=function(t){try{this._tapError.call(this._context,t)}catch(t){return void this.destination.error(t)}this.destination.error(t)},e.prototype._complete=function(){try{this._tapComplete.call(this._context)}catch(t){return void this.destination.error(t)}return this.destination.complete()},e}(r.a)},152:function(t,e,a){"use strict";a.d(e,"a",(function(){return c}));var n=a(83),r=a(153);function c(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return Object(r.a)()(n.a.apply(void 0,t))}},153:function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));var n=a(148);function r(){return Object(n.a)(1)}},154:function(t,e,a){"use strict";a.d(e,"a",(function(){return c}));var n=a(132),r=a(124);function c(t,e,a){return void 0===e&&(e=r.a),void 0===a&&(a=r.a),Object(n.a)((function(){return t()?e:a}))}},156:function(t,e,a){"use strict";a.d(e,"a",(function(){return c}));var n=a(2),r=a(5);function c(t){return void 0===t&&(t=-1),function(e){return e.lift(new i(t,e))}}var i=function(){function t(t,e){this.count=t,this.source=e}return t.prototype.call=function(t,e){return e.subscribe(new o(t,this.count,this.source))},t}(),o=function(t){function e(e,a,n){var r=t.call(this,e)||this;return r.count=a,r.source=n,r}return n.a(e,t),e.prototype.error=function(e){if(!this.isStopped){var a=this.source,n=this.count;if(0===n)return t.prototype.error.call(this,e);n>-1&&(this.count=n-1),a.subscribe(this._unsubscribeAndRecycle())}},e}(r.a)},181:function(t,e,a){"use strict";a.d(e,"a",(function(){return o}));var n=a(30),r=new(0,a(52).BehaviorSubject),c={role:null,page:1,numberDisplay:12,dataCharacter:[],dataCharacterRaw:[]},i=c,o={initialState:c,updateData:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:c;i=Object(n.a)(Object(n.a)({},i),t),r.next(i)},init:function(){r.next(i)},subscribe:function(t){return r.subscribe(t)},currentState:function(){var t;return r.subscribe((function(e){return t=e})),t||c},updateRole:function(t){i=Object(n.a)(Object(n.a)({},i),{},{role:t}),r.next(i)},updatePage:function(t){i=Object(n.a)(Object(n.a)({},i),{},{page:t}),r.next(i)}}},241:function(t,e,a){},330:function(t,e,a){"use strict";a.r(e);var n=a(127),r=a(64),c=a(30),i=a(26),o=(a(241),a(143),a(7)),u=a(119),s=a(0),p=a.n(s),l=a(160),f=a(13),h=a(154),b=a(142),m=a(123),d=a(83),j=a(101),v=a(40),O=a(166),g=a(156),y=a(136),w=a(149),E=a(205),x=a(100),N=a(153),_=a(181),S=a(129),C=Object(o.a)((function(){return a.e(5).then(a.bind(null,208))}));function D(t){return Object(h.a)((function(){return S.a.currentState().dataCharacterDetail&&S.a.currentState().dataCharacterDetail[t]&&S.a.currentState().dataCharacterDetail[t].info}),Object(b.a)(0).pipe(Object(v.a)((function(){return S.a.currentState().dataCharacterDetail[t].info.data}))),Object(j.a)("https://api.jikan.moe/v4/characters/".concat(t)).pipe(Object(O.a)(3e3),Object(g.a)(10),Object(y.a)("response","data"),Object(w.a)((function(t){if(500===t.status)throw Error("Something went wrong")}))))}function I(t){return Object(h.a)((function(){return S.a.currentState().dataCharacterDetail&&S.a.currentState().dataCharacterDetail[t]&&S.a.currentState().dataCharacterDetail[t]["voice actor"]}),Object(b.a)(0).pipe(Object(v.a)((function(){return S.a.currentState().dataCharacterDetail[t]["voice actor"].data}))),Object(j.a)("https://api.jikan.moe/v4/characters/".concat(t,"/voices")).pipe(Object(O.a)(3e3),Object(E.a)(1500),Object(w.a)((function(t){if(500===t.status)throw Error("Something went wrong")})),Object(y.a)("response","data"),Object(g.a)(10)))}function k(t){return Object(h.a)((function(){return S.a.currentState().dataCharacterDetail&&S.a.currentState().dataCharacterDetail[t]&&S.a.currentState().dataCharacterDetail[t].anime}),Object(b.a)(0).pipe(Object(v.a)((function(){return S.a.currentState().dataCharacterDetail[t].anime.data}))),Object(j.a)("https://api.jikan.moe/v4/characters/".concat(t,"/anime")).pipe(Object(O.a)(3e3),Object(E.a)(1500),Object(g.a)(10),Object(y.a)("response","data"),Object(w.a)((function(t){if(500===t.status)throw Error("Something went wrong")}))))}function z(t){return Object(h.a)((function(){return S.a.currentState().dataCharacterDetail&&S.a.currentState().dataCharacterDetail[t]&&S.a.currentState().dataCharacterDetail[t].manga}),Object(b.a)(0).pipe(Object(v.a)((function(){return S.a.currentState().dataCharacterDetail[t].manga.data}))),Object(j.a)("https://api.jikan.moe/v4/characters/".concat(t,"/manga")).pipe(Object(O.a)(3e3),Object(E.a)(1500),Object(g.a)(10),Object(y.a)("response","data"),Object(w.a)((function(t){if(t.status)throw Error("Something went wrong")}))))}e.default=function(t){var e=parseInt(t.match.params.characterId),a=Object(s.useState)({}),o=Object(i.a)(a,2),h=o[0],b=o[1],j=Object(s.useRef)({});Object(s.useEffect)((function(){return window.scroll({top:0}),function(){_.a.updateData({role:null})}}),[]);var O=Object(s.useState)(!1),g=Object(i.a)(O,2),y=g[0],w=g[1];return Object(s.useEffect)((function(){var t=function(t,e){return Object(m.a)([D(t).pipe(Object(v.a)((function(t){return{data:t,typeResponse:"info"}})),Object(x.a)((function(){return Object(d.a)({})}))),k(t).pipe(Object(v.a)((function(t){return{data:t,typeResponse:"anime"}})),Object(x.a)((function(){return Object(d.a)([])}))),z(t).pipe(Object(v.a)((function(t){return{data:t,typeResponse:"manga"}})),Object(x.a)((function(){return Object(d.a)([])}))),I(t).pipe(Object(v.a)((function(t){return{data:t,typeResponse:"voice actor"}})),Object(x.a)((function(){return Object(d.a)([])})))]).pipe(Object(N.a)(),Object(v.a)((function(a){switch(S.a.updateData({dataCharacterDetail:Object(c.a)(Object(c.a)({},S.a.currentState().dataCharacterDetail),{},Object(r.a)({},t,Object(c.a)(Object(c.a)({},(S.a.currentState().dataCharacterDetail||{})[t]),{},Object(r.a)({},a.typeResponse,Object(c.a)({},a)))))}),a.typeResponse){case"info":return Object(c.a)({},a.data);case"anime":return{animeography:Object(n.a)(a.data)};case"manga":return{mangagraphy:Object(n.a)(a.data.map((function(t){return{anime:t.manga,role:t.role,type:"manga"}}))),typeResponse:"manga"};default:return e(!0),{voice_actors:a.data}}})),Object(x.a)((function(t){return console.error(t),Object(d.a)({error:"Something went wrong"})})))}(e,w).subscribe((function(t){t.error||(b(Object(c.a)(Object(c.a)({},j.current),t)),j.current=Object(c.a)(Object(c.a)({},j.current),t))}));return function(){t.unsubscribe()}}),[e]),p.a.createElement("div",{className:"character-detail-container"},p.a.createElement("div",{className:"character-information-wrapper"},p.a.createElement("img",{className:"image-character",src:h.images?h.images.webp.image_url:"https://us.123rf.com/450wm/pikepicture/pikepicture1612/pikepicture161200526/68824651-stock-vector-male-default-placeholder-avatar-profile-gray-picture-isolated-on-white-background-for-your-design-ve.jpg?ver=6",alt:"image_character"}),h.name&&p.a.createElement("div",{className:"character-information"},h.name&&p.a.createElement("div",{className:"wrapper-text"},p.a.createElement("span",{className:"text-capitalize"},"name"),p.a.createElement("span",null,h.name)),_.a.currentState()&&_.a.currentState().role&&p.a.createElement("div",{className:"wrapper-text"},p.a.createElement("span",{className:"text-capitalize"},"role"),p.a.createElement("span",null,_.a.currentState().role)),h.name_kanji&&p.a.createElement("div",{className:"wrapper-text"},p.a.createElement("span",{className:"text-capitalize"},"name kanji"),p.a.createElement("span",null,h.name_kanji)),!!h.favorites&&p.a.createElement("div",{className:"wrapper-text"},p.a.createElement("span",{className:"text-capitalize"},"favorites"),p.a.createElement("span",null,h.favorites)),h.nicknames&&h.nicknames.length>0&&p.a.createElement("div",{className:"wrapper-text"},p.a.createElement("span",{className:"text-capitalize"},"nicknames"),p.a.createElement("span",null,h.nicknames.join(", "))))),h.about&&p.a.createElement("div",{className:"wrapper-text",style:{boxShadow:"none"}},p.a.createElement("span",{className:"text-capitalize"},"about"),p.a.createElement("pre",{className:"text-about-character"},h.about.replace(/\\n/g,""))),h.animeography&&0!==h.animeography.length&&p.a.createElement("div",{className:"character-appear-container"},p.a.createElement("h1",{className:"text-capitalize"},"Related Anime"),p.a.createElement(C,{animeList:h.animeography,lazy:!0})),h.mangagraphy&&0!==h.mangagraphy.length&&p.a.createElement("div",{className:"character-appear-container"},p.a.createElement("h1",{className:"text-capitalize"},"Related Manga"),p.a.createElement(C,{animeList:h.mangagraphy,lazy:!0})),h.voice_actors&&h.voice_actors.length>0&&p.a.createElement("div",{className:"voice-actor-container"},p.a.createElement("h1",{className:"text-capitalize"},"Voice actor",h.voice_actors.length>1?"s":""),p.a.createElement("div",{className:"voice-actor-list"},h.voice_actors.map((function(t,e){return p.a.createElement(f.b,{to:"/person/"+t.person.mal_id+"-"+t.person.name.replace(/[ /%^&*():.$,]/g,"-").toLocaleLowerCase(),className:"actor-item",key:e},p.a.createElement(l.LazyLoadImage,{src:t.person.images.jpg.image_url,alt:"person_image",width:"100%",effect:"opacity",height:"100%"}),p.a.createElement("div",{className:"actor-name"},p.a.createElement("h3",{title:t.person.name.replace(",","")},t.person.name.replace(",","")),p.a.createElement("div",{title:t.language},"( ",t.language," )")))})))),!y&&p.a.createElement("div",{style:{display:"flex",justifyContent:"center"}},p.a.createElement(u.a,{color:"secondary",size:"4rem"})))}}}]);
//# sourceMappingURL=13.67b49f44.chunk.js.map