(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[14],{137:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var r=n(2),a=n(40),i=n(123),c=n(21);function o(t,e){return"function"===typeof e?function(n){return n.pipe(o((function(n,r){return Object(i.a)(t(n,r)).pipe(Object(a.a)((function(t,a){return e(n,t,r,a)})))})))}:function(e){return e.lift(new u(t))}}var u=function(){function t(t){this.project=t}return t.prototype.call=function(t,e){return e.subscribe(new s(t,this.project))},t}(),s=function(t){function e(e,n){var r=t.call(this,e)||this;return r.project=n,r.index=0,r}return r.a(e,t),e.prototype._next=function(t){var e,n=this.index++;try{e=this.project(t,n)}catch(r){return void this.destination.error(r)}this._innerSub(e)},e.prototype._innerSub=function(t){var e=this.innerSubscription;e&&e.unsubscribe();var n=new c.a(this),r=this.destination;r.add(n),this.innerSubscription=Object(c.c)(t,n),this.innerSubscription!==n&&r.add(this.innerSubscription)},e.prototype._complete=function(){var e=this.innerSubscription;e&&!e.closed||t.prototype._complete.call(this),this.unsubscribe()},e.prototype._unsubscribe=function(){this.innerSubscription=void 0},e.prototype.notifyComplete=function(){this.innerSubscription=void 0,this.isStopped&&t.prototype._complete.call(this)},e.prototype.notifyNext=function(t){this.destination.next(t)},e}(c.b)},143:function(t,e,n){},144:function(t,e,n){"use strict";n.d(e,"b",(function(){return l})),n.d(e,"a",(function(){return f}));var r=n(2),a=n(57),i=n(41),c=n(145),o=n(147),u=n(63),s={};function l(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=void 0,r=void 0;return Object(a.a)(t[t.length-1])&&(r=t.pop()),"function"===typeof t[t.length-1]&&(n=t.pop()),1===t.length&&Object(i.a)(t[0])&&(t=t[0]),Object(u.a)(t,r).lift(new f(n))}var f=function(){function t(t){this.resultSelector=t}return t.prototype.call=function(t,e){return e.subscribe(new p(t,this.resultSelector))},t}(),p=function(t){function e(e,n){var r=t.call(this,e)||this;return r.resultSelector=n,r.active=0,r.values=[],r.observables=[],r}return r.a(e,t),e.prototype._next=function(t){this.values.push(s),this.observables.push(t)},e.prototype._complete=function(){var t=this.observables,e=t.length;if(0===e)this.destination.complete();else{this.active=e,this.toRespond=e;for(var n=0;n<e;n++){var r=t[n];this.add(Object(o.a)(this,r,void 0,n))}}},e.prototype.notifyComplete=function(t){0===(this.active-=1)&&this.destination.complete()},e.prototype.notifyNext=function(t,e,n){var r=this.values,a=r[n],i=this.toRespond?a===s?--this.toRespond:this.toRespond:0;r[n]=e,0===i&&(this.resultSelector?this._tryResultSelector(r):this.destination.next(r.slice()))},e.prototype._tryResultSelector=function(t){var e;try{e=this.resultSelector.apply(this,t)}catch(n){return void this.destination.error(n)}this.destination.next(e)},e}(c.a)},145:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(2),a=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return r.a(e,t),e.prototype.notifyNext=function(t,e,n,r,a){this.destination.next(e)},e.prototype.notifyError=function(t,e){this.destination.error(t)},e.prototype.notifyComplete=function(t){this.destination.complete()},e}(n(5).a)},147:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var r=n(2),a=function(t){function e(e,n,r){var a=t.call(this)||this;return a.parent=e,a.outerValue=n,a.outerIndex=r,a.index=0,a}return r.a(e,t),e.prototype._next=function(t){this.parent.notifyNext(this.outerValue,t,this.outerIndex,this.index++,this)},e.prototype._error=function(t){this.parent.notifyError(t,this),this.unsubscribe()},e.prototype._complete=function(){this.parent.notifyComplete(this),this.unsubscribe()},e}(n(5).a),i=n(58),c=n(12);function o(t,e,n,r,o){if(void 0===o&&(o=new a(t,n,r)),!o.closed)return e instanceof c.a?e.subscribe(o):Object(i.a)(e)(o)}},148:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(126),a=n(60);function i(t){return void 0===t&&(t=Number.POSITIVE_INFINITY),Object(r.a)(a.a,t)}},152:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(83),a=n(153);function i(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return Object(a.a)()(r.a.apply(void 0,t))}},153:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(148);function a(){return Object(r.a)(1)}},158:function(t,e,n){"use strict";n.d(e,"c",(function(){return h})),n.d(e,"b",(function(){return v})),n.d(e,"a",(function(){return y}));var r=n(142),a=n(83),i=n(123),c=n(101),o=n(169),u=n(136),s=n(156),l=n(100),f=n(137),p=n(30),d=n(75),m={currentPageBoxMovie:1,currentPageUpdatedMovie:1,updatedMovie:[],boxMovie:[],lastPageUpdatedMovie:1,lastPageBoxMovie:1,subNavToggle:null,triggerFetch:!1},g=new d.a(m),b=m,h={initialState:m,subscribe:function(t){return g.subscribe((function(e){return t(e)}))},currentState:function(){var t;return g.subscribe((function(e){t=e})),t||m},init:function(){g.next(b)},updateData:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:m;b=Object(p.a)(Object(p.a)({},b),t),g.next(b)},updateDataQuick:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:m,e=Object.keys(t);e.forEach((function(e){b[e]=t[e]}))}},v=function(){return Object(r.a)(0).pipe(Object(o.a)(Object(c.a)({url:"/api/movies/latest?page="+h.currentState().currentPageUpdatedMovie}).pipe(Object(u.a)("response","message"),Object(s.a)(20),Object(l.a)((function(){return Object(a.a)([])})))))},y=function(t){return Object(r.a)(0).pipe(Object(f.a)((function(){return Object(c.a)({url:"/api/movies/box?page="+h.currentState().currentPageBoxMovie,headers:{authorization:"Bearer ".concat(t)}}).pipe(Object(u.a)("response","message"),Object(s.a)(20),Object(l.a)((function(t){return Object(i.a)([])})))})))}},164:function(t,e,n){"use strict";n.r(e);var r=n(18),a=n.n(r),i=n(36),c=n(26),o=(n(289),n(143),n(0)),u=n.n(o),s=n(120),l=n(160),f=n(13),p=n(183),d=n(158),m=n(196),g=n(44);e.default=function(t){var e=t.anime,n=t.lazy,r=void 0!==n&&n,p=t.virtual,b=void 0!==p&&p,O=t.isAllowDelete,j=t.styleAnimeItem,S=void 0===j?{}:j,D=t.searchBy,_=t.type,w=Object(o.useRef)(),x=Object(s.a)(["idCartoonUser"]),P=Object(c.a)(x,1)[0];return u.a.createElement("div",{ref:w,style:S,className:"anime-item",onMouseDown:v(w),onMouseLeave:h(w),onMouseMove:y(w,b),title:e.title||e.name},u.a.createElement("div",{className:"layer-upcoming-anime"}),O&&u.a.createElement("div",{className:"anime-delete-button top-left_summary"},u.a.createElement("i",{className:"fas fa-times",onClick:Object(i.a)(a.a.mark((function t(){return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,g.a.updateIsShowBlockPopUp(!0),t.next=4,fetch("/api/movies/box/".concat(e.malId),{method:"DELETE",headers:{authorization:"Bearer ".concat(P.idCartoonUser)}});case 4:d.c.updateData({triggerFetch:!d.c.currentState().triggerFetch}),t.next=9;break;case 7:t.prev=7,t.t0=t.catch(0);case 9:case"end":return t.stop()}}),t,null,[[0,7]])})))})),u.a.createElement(f.b,{to:"/".concat("manga"!==_?"anime"!==D?"".concat("people"===D?"person":D.replace("s","")):"anime":"manga","/").concat(e.malId||e.mal_id,"-").concat(e.title?e.title.replace(/[ /%^&*():.$,]/g,"-").toLocaleLowerCase():e.name.replace(/[ /%^&*():.$,]/g,"-").toLocaleLowerCase())},e.airing_start&&new Date(e.airing_start).getTime()<=new Date(Date.now()).getTime()&&u.a.createElement("div",{title:new Date(e.airing_start).toUTCString().slice(4,17),className:"anime-info-display_summary top-left_summary color-green"},new Date(e.airing_start).getMonth()+1,"-",new Date(e.airing_start).getDate(),"-",new Date(e.airing_start).getFullYear()),e.airing_start&&new Date(e.airing_start).getTime()>new Date(Date.now()).getTime()&&u.a.createElement("div",{title:new Date(e.airing_start).toUTCString().slice(4,17),className:"anime-info-display_summary top-left_summary color-green"},e.airing_start&&u.a.createElement("div",null,new Date(e.airing_start).getMonth()+1,"-",new Date(e.airing_start).getDate(),"-",new Date(e.airing_start).getFullYear())),e.airing_start&&new Date(e.airing_start).getTime()<=new Date(Date.now()).getTime()&&u.a.createElement("div",{title:new Date(e.airing_start).toUTCString().slice(4,17),className:"anime-info-display_summary top-left_summary color-green"},new Date(e.airing_start).getMonth()+1,"-",new Date(e.airing_start).getDate(),"-",new Date(e.airing_start).getFullYear()),e.aired&&e.aired.prop.from.day&&!e.aired.prop.to.day&&u.a.createElement("div",{title:"Started airing on "+new Date(e.aired.from).toUTCString(),className:"anime-info-display_summary top-left_summary color-green"},e.aired.prop.from.month,e.aired.prop.from.month&&"/",e.aired.prop.from.day,e.aired.prop.from.day&&"/",e.aired.prop.from.year),e.aired&&e.aired.prop.to.day&&u.a.createElement("div",{title:"Finished airing on "+new Date(e.aired.to).toUTCString(),className:"anime-info-display_summary top-left_summary color-yellow"},e.aired.prop.to.month,e.aired.prop.to.month&&"/",e.aired.prop.to.day,e.aired.prop.to.day&&"/",e.aired.prop.to.year," "),e.recommendation_count||!parseFloat(e.score)&&!e.favorites?null:u.a.createElement("div",{title:e.score?"".concat(e.score," out of 10"):"Favorites",className:"anime-info-display_summary top-right_summary color-red"},parseFloat(e.score)?"".concat(e.score,"/10"):e.favorites),e.recommendation_count&&u.a.createElement("div",{title:"".concat(e.recommendation_count," people recommend"),className:"anime-info-display_summary top-right_summary color-red"},e.recommendation_count),!0===r&&u.a.createElement(l.LazyLoadImage,{draggable:!1,style:{objectFit:"contain",position:"absolute",top:0,left:0},effect:"opacity",src:e.imageUrl||e.images.webp&&e.images.webp.large_image_url||e.images.jpg&&e.images.jpg.large_image_url||e.images.webp&&e.images.webp.image_url||e.images.jpg&&e.images.jpg.image_url||e.image_url,alt:e.title||e.name}),!1===r&&u.a.createElement("img",{draggable:!1,style:{objectFit:"contain",position:"absolute",top:0,left:0},src:e.imageUrl||e.images.webp&&e.images.webp.large_image_url||e.images.jpg&&e.images.jpg.large_image_url||e.images.webp&&e.images.webp.image_url||e.images.jpg&&e.images.jpg.image_url||e.image_url,alt:e.title||e.name}),u.a.createElement("div",{className:"anime-item-info"},u.a.createElement("h3",{style:{margin:"5px"},title:e.title},e.title||e.name),e.genres&&!Object(m.d)(e.genres)&&u.a.createElement("h3",{title:"age_limited",style:{color:"red",margin:"0"}},"18+"),e.explicit_genres&&!Object(m.d)(e.explicit_genres)&&u.a.createElement("h3",{title:"age_limited",style:{color:"red",margin:"0"}},"18+"))))};var b=0;function h(t){return function(){b=0,t.current.style.transition="0.1s",t.current.style.transform="perspective(500px) scale(1) rotateX(0) rotateY(0)",t.current.style.zIndex=1,setTimeout((function(){t.current&&(t.current.style.transition="0s")}),300)}}function v(t){return function(){t.current.style.transition="0.3s",t.current.style.transform="scale(1)"}}function y(t,e){return function(n){var r,a,i=p.c.currentState().isScrolling;if(t.current.style.transition="0.3s",i)t.current.className="anime-item relative";else{if("anime-item relative"===t.current.className)return void(t.current.className="anime-item");0===b&&(b=t.current.getBoundingClientRect().x);var c=n.pageX-(b+n.movementX)%n.pageX-t.current.offsetWidth/2;1.5*c<1.5*t.current.offsetWidth&&(r=1.5*c+t.current.offsetWidth/2),a=t.current.parentElement.className.includes("list-anime-nowrap")?n.pageY-t.current.parentElement.parentElement.offsetTop-t.current.offsetWidth/2:e?n.pageY-(t.current.parentElement.parentElement.offsetTop+t.current.parentElement.offsetTop):n.pageY-t.current.offsetTop;var o=t.current.clientWidth,u=t.current.clientHeight,s="perspective(500px) scale(1.1) rotateX("+(a-u/2)/u*-20+"deg) rotateY("+(r-o/2)/o*20+"deg)";t.current.style.transform=s,t.current.style.zIndex=10}}}},169:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(137);function a(t,e){return e?Object(r.a)((function(){return t}),e):Object(r.a)((function(){return t}))}},171:function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));var r=n(144);function a(t){return function(e){return e.lift(new r.a(t))}}},178:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n(12),a=n(53),i=n(125);function c(t,e){return void 0===t&&(t=0),void 0===e&&(e=a.a),(!Object(i.a)(t)||t<0)&&(t=0),e&&"function"===typeof e.schedule||(e=a.a),new r.a((function(n){return n.add(e.schedule(o,t,{subscriber:n,counter:0,period:t})),n}))}function o(t){var e=t.subscriber,n=t.counter,r=t.period;e.next(n),this.schedule({subscriber:e,counter:n+1,period:r},r)}},182:function(t,e,n){"use strict";n.d(e,"a",(function(){return D})),n.d(e,"b",(function(){return _})),n.d(e,"c",(function(){return w})),n.d(e,"d",(function(){return x}));var r,a=n(107),i=n(123),c=n(142),o=n(83),u=n(101),s=n(140),l=n(136),f=n(40),p=n(185),d=n(171),m=n(169),g=n(156),b=n(100),h=n(30),v=n(75),y=(new Date(Date.now()).getMonth()+1)/3;y<=1&&(r="winter"),1<y&&y<=2&&(r="spring"),2<y&&y<=3&&(r="summer"),3<y&&(r="fall");var O={maxPage:1,dataDetail:[],dataDetailOriginal:[],modeFilter:"filter",score:0,genreId:"0",currentPage:1,numberOfProduct:40,season:r,year:new Date(Date.now()).getFullYear(),textSearch:"",screenWidth:null,currentPageOnDestroy:null,currentYearOnDestroy:null,currentSeasonOnDestroy:null,isFetching:!1,triggerScroll:!1,isSmoothScroll:!0,isInit:!0},j=new v.a(O),S=O,D={initialState:O,subscribe:function(t){return j.subscribe((function(e){return t(e)}))},currentState:function(){var t;return j.subscribe((function(e){t=e})),t||O},init:function(){S=Object(h.a)(Object(h.a)({},S),{},{screenWidth:window.innerWidth}),j.next(S)},updateData:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:O;S=Object(h.a)(Object(h.a)({},S),t),j.next(S)},updateDataQuick:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:O,e=Object.keys(t);e.forEach((function(e){S[e]=t[e]}))},increaseCurrentPage:function(){S=Object(h.a)(Object(h.a)({},S),{},{currentPage:S.currentPage+1<=S.maxPage?S.currentPage+1:S.currentPage}),j.next(S)},decreaseCurrentPage:function(){S=Object(h.a)(Object(h.a)({},S),{},{currentPage:S.currentPage-1>0?S.currentPage-1:S.currentPage}),j.next(S)},updateSeasonYear:function(t,e,n){S=Object(h.a)(Object(h.a)({},S),{},{season:t,year:e,score:n}),j.next(S)}},_=function(){return Object(a.a)(document,"keydown").pipe(Object(s.a)((function(t){return"BODY"===t.target.tagName})),Object(l.a)("keyCode"),Object(f.a)((function(t){switch(t){case 39:return D.increaseCurrentPage(),void D.updateData({shouldScrollToSeeMore:!0});case 37:return D.decreaseCurrentPage(),void D.updateData({shouldScrollToSeeMore:!0});default:return}})))},w=function(t,e,n){var r=Object(a.a)(t,"change").pipe(Object(l.a)("target","value"),Object(f.a)((function(t){return parseInt(t)}))),c=Object(a.a)(e,"change").pipe(Object(l.a)("target","value")),o=Object(a.a)(n,"change").pipe(Object(l.a)("target","value"),Object(f.a)((function(t){return parseInt(t)})));return Object(i.a)([r.pipe(Object(p.a)(D.currentState().year)),c.pipe(Object(p.a)(D.currentState().season)),o.pipe(Object(p.a)(D.currentState().score))]).pipe(Object(d.a)())},x=function(t,e,n){return Object(c.a)(0).pipe(Object(m.a)(Object(u.a)("https://api.jikan.moe/v4/seasons/".concat(t,"/").concat(e,"?page=").concat(n)).pipe(Object(l.a)("response"),Object(f.a)((function(t){return D.updateDataQuick({maxPage:t.pagination.last_visible_page}),t.data})),Object(g.a)(20),Object(b.a)((function(){return Object(o.a)([])})))))}},183:function(t,e,n){"use strict";n.d(e,"c",(function(){return j})),n.d(e,"b",(function(){return S})),n.d(e,"a",(function(){return D})),n.d(e,"d",(function(){return _}));var r=n(142),a=n(178),i=n(53),c=n(83),o=n(101),u=n(168),s=n(149),l=n(140),f=n(102),p=n(137),d=n(136),m=n(156),g=n(100),b=n(30),h=n(75),v={offsetLeft:0,mouseStartX:null,modeScrolling:"interval",upcomingAnimeList:[],shouldScrollLeft:!0,screenWidth:null,isScrolling:!1},y=new h.a(v),O=v,j={initialState:v,subscribe:function(t){return y.subscribe((function(e){return t(e)}))},currentState:function(){var t;return y.subscribe((function(e){t=e})),t||v},init:function(){y.next(O)},updateData:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v;O=Object(b.a)(Object(b.a)({},O),t),y.next(O)},updateDataQuick:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v,e=Object.keys(t);e.forEach((function(e){O[e]=t[e]}))}},S=function(t,e,n,a){var i=0,c=j.currentState().upcomingAnimeList.length-7;return Object(r.a)(0,2).pipe(Object(u.a)((function(){return i<t})),Object(s.a)((function(){j.updateDataQuick({modeScrolling:"enter"}),j.updateDataQuick({shouldScrollLeft:!1}),i+=10;var t=!0,r=j.currentState().offsetLeft-i*n;e.childNodes[c]&&Math.abs(r)>=e.childNodes[c].offsetLeft&&(j.updateDataQuick({offsetLeft:-e.childNodes[c-a].offsetLeft}),e.style.transition="0s",e.style.transform="translateX(".concat(j.currentState().offsetLeft,")"),t=!1),e.childNodes[0]&&r-e.childNodes[0].offsetLeft>0&&(console.log("reset"),j.updateDataQuick({offsetLeft:-e.childNodes[a].offsetLeft}),e.style.transition="0s",e.style.transform="translateX(".concat(j.currentState().offsetLeft,")"),t=!1),t&&(e.style.transform="translateX(".concat(j.currentState().offsetLeft-i*n,"px)"))})),Object(l.a)((function(){return i>=t})),Object(s.a)((function(){j.updateDataQuick({offsetLeft:j.currentState().offsetLeft-i*n}),j.updateDataQuick({shouldScrollLeft:!0,modeScrolling:"interval"})})))},D=function(t,e){return Object(a.a)(20).pipe(Object(l.a)((function(){return"interval"===j.currentState().modeScrolling})),Object(s.a)((function(){var e=j.currentState().offsetLeft-2.4;j.updateDataQuick({offsetLeft:e}),t.style.transform="translateX(".concat(e,"px)")})),Object(l.a)((function(){return t.childNodes[e]&&Math.abs(j.currentState().offsetLeft)>=t.childNodes[e].offsetLeft})),Object(f.a)(1e3,i.b,{leading:!0,trailing:!1}))},_=function(){return Object(r.a)(0).pipe(Object(l.a)((function(){return 0===j.currentState().upcomingAnimeList.length})),Object(p.a)((function(){return Object(o.a)({url:"https://api.jikan.moe/v4/anime?status=upcoming&order_by=favorites&sort=desc"}).pipe(Object(d.a)("response","data"),Object(m.a)(),Object(g.a)((function(){return Object(c.a)([])})))})))}},185:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n(152),a=n(57);function i(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=t[t.length-1];return Object(a.a)(n)?(t.pop(),function(e){return Object(r.a)(t,e,n)}):function(e){return Object(r.a)(t,e)}}},196:function(t,e,n){"use strict";n.d(e,"c",(function(){return c})),n.d(e,"b",(function(){return o})),n.d(e,"a",(function(){return u})),n.d(e,"e",(function(){return s})),n.d(e,"d",(function(){return l}));var r,a=n(26),i=n(182),c=function(t){return function(){var e=i.a.subscribe(t);return i.a.init(),function(){i.a.updateData({isInit:!0}),e.unsubscribe()}}},o=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i.a.currentState();return function(){var e=t.dataDetailOriginal.filter((function(e){var n=e.score;return null===n&&0===t.score||n>t.score}));i.a.updateData({dataDetail:e}),i.a.currentState().maxPage<i.a.currentState().currentPage&&i.a.updateData({currentPage:1})}},u=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i.a.currentState();return function(){t.currentPage===i.a.currentState().currentPageOnDestroy&&t.season===i.a.currentState().currentSeasonOnDestroy&&t.year===i.a.currentState().currentYearOnDestroy||(i.a.updateData({isFetching:!0}),r&&r.unsubscribe(),r=Object(i.d)(t.year,t.season,t.currentPage).subscribe((function(e){i.a.currentState().isInit||i.a.updateData({triggerScroll:!i.a.currentState().triggerScroll,isInit:!1});var n=e.filter((function(e){var n=e.score;return null===n&&0===t.score||n>t.score}));t.season===i.a.currentState().currentSeasonOnDestroy&&t.year===i.a.currentState().currentYearOnDestroy||i.a.updateData({currentPage:1}),i.a.updateData({dataDetail:n,dataDetailOriginal:e,isFetching:!1,isSmoothScroll:!1}),i.a.updateDataQuick({isInit:!1}),i.a.currentState().maxPage<i.a.currentState().currentPage&&i.a.updateData({currentPage:1}),i.a.updateDataQuick({currentPageOnDestroy:i.a.currentState().currentPage,currentSeasonOnDestroy:i.a.currentState().season,currentYearOnDestroy:i.a.currentState().year})})))}},s=function(t,e,n,r){return function(){e.current&&n.current&&(e.current.value=t.season,n.current.value=t.year);var c=document.querySelector(".wrapper-search-anime-list input");c&&""===c.value.trim()&&(c.value=t.textSearch);var o,u=Object(i.b)().subscribe();return n.current&&e.current&&r.current&&(o=Object(i.c)(n.current,e.current,r.current).subscribe((function(t){var e=Object(a.a)(t,3),n=e[0],r=e[1],c=e[2];i.a.currentState().isInit||i.a.updateData({triggerScroll:!i.a.currentState().triggerScroll,isSmoothScroll:!1,isInit:!1}),i.a.updateSeasonYear(r,n,c)}))),function(){o&&o.unsubscribe(),u.unsubscribe()}}};function l(t){var e=!0;return t.forEach((function(t){"Hentai"===t.name&&(e=!1)})),e}},289:function(t,e,n){}}]);
//# sourceMappingURL=14.aaceecb6.chunk.js.map