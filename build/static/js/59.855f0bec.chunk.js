(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[59],{285:function(e,t,a){"use strict";a.r(t);a(286);var c=a(0),n=a.n(c),i=a(211),r=a(157);var l=function(e,t){e.clipboardData.setData("text",t.embedUrl),e.preventDefault()};t.default=function(e){var t=e.currentEpisode,a=e.user,c=i.b.currentState(),s=c.imageUrl,o=c.switchVideo;return n.a.createElement("div",{className:"video-player-container"},n.a.createElement("div",{onClick:function(){return i.b.updateSwitchVideo(!0)},className:"section-play-movie".concat(t&&!t.typeVideo?" padding-control":" padding-none")},!o&&n.a.createElement("div",null,n.a.createElement("img",{className:"image-video-player",src:r.a.currentState().dataLargePicture||s,alt:"image_video"}),n.a.createElement("div",{className:"play-video-button-container"},n.a.createElement("span",{className:"play-video-button"},"\u25b6"))),o&&t&&!t.typeVideo&&n.a.createElement("iframe",{className:"embed-video-player",width:"100%",height:"100%",src:t.embedUrl,title:"Episode "+t.episode,allowFullScreen:!0}),o&&t&&t.typeVideo&&n.a.createElement("div",{className:"video-container__episode"},a&&n.a.createElement("div",{className:"container-copy"},n.a.createElement("button",{className:"btn btn-primary",style:{backgroundColor:"black"},onClick:function(){document.querySelector(".result-success").style.display="inline-block",document.addEventListener("copy",(function(e){l(e,t)})),document.execCommand("copy")}},"Copy Video Url for theater"),n.a.createElement("div",{className:"result-success"},n.a.createElement("img",{src:"https://thumbs.gfycat.com/ShyCautiousAfricanpiedkingfisher-size_restricted.gif",alt:"check_success"}),n.a.createElement("span",null,"Ok"))),n.a.createElement("video",{className:"video-player",width:"100%",height:"100%",src:t.embedUrl,controls:!0,playsInline:!0}))))}},286:function(e,t,a){}}]);
//# sourceMappingURL=59.855f0bec.chunk.js.map