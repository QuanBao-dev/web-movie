(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[54],{272:function(e,a,t){},334:function(e,a,t){"use strict";t.r(a);var r=t(30),c=t(26),n=(t(272),t(7)),u=t(119),i=t(0),l=t.n(i),s=t(3),o=t(142),h=t(107),b=t(181),d=t(133),p=t(140),m=t(169),f=Object(n.a)((function(){return Promise.all([t.e(0),t.e(53)]).then(t.bind(null,294))}));a.default=function(e){var a=e.lazy,t=void 0!==a&&a,n=e.isLoading,y=Object(s.f)(),g=Object(i.useState)(b.a.currentState()),j=Object(c.a)(g,2),O=j[0],C=j[1],E=Object(i.useRef)();return Object(i.useEffect)((function(){var e=b.a.subscribe(C);return b.a.init(),function(){e.unsubscribe()}}),[O.page]),Object(i.useEffect)((function(){var e=document.querySelector(".see-more-character");e&&(b.a.currentState().page*b.a.currentState().numberDisplay>=O.dataCharacter.length?e.style.display="none":e.style.display="block")}),[O.dataCharacter.length,O.page]),Object(i.useEffect)((function(){var e=Object(o.a)(0).pipe(Object(p.a)((function(){return E.current})),Object(m.a)(Object(h.a)(E.current,"input"))).subscribe((function(e){b.a.updateData({dataCharacter:b.a.currentState().dataCharacterRaw.filter((function(a){return!!a.character.name.match(new RegExp(e.target.value,"i"))}))})}));return function(){b.a.updateData({dataCharacter:b.a.currentState().dataCharacterRaw}),e.unsubscribe()}}),[n]),l.a.createElement("div",null,l.a.createElement("h1",{className:"title"},"Characters"),!1===n&&l.a.createElement("div",{style:{width:"100%",maxWidth:800,margin:"auto"}},l.a.createElement(d.a,{label:"Search Character",input:E})),null!==n&&!0===n&&l.a.createElement(u.a,{color:"secondary",size:"4rem"}),!1===n&&0===O.dataCharacter.length&&l.a.createElement("h3",{style:{textAlign:"center"}},"No Character has been found"),!1===n&&O.dataCharacter.length>0&&l.a.createElement("div",{className:"character-list"},O.dataCharacter.slice(0,b.a.currentState().page*b.a.currentState().numberDisplay).map((function(e,a){return l.a.createElement(f,{key:a,lazy:t,characterData:Object(r.a)(Object(r.a)({},e.character),{},{role:e.role}),history:y})})),l.a.createElement("div",{className:"see-more-character",style:{display:"none"},onClick:function(){var e=b.a.currentState().page;b.a.updatePage(e+1)}},"See more")))}}}]);
//# sourceMappingURL=54.5dab1855.chunk.js.map