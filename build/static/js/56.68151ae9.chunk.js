(this["webpackJsonpmy-app-2"]=this["webpackJsonpmy-app-2"]||[]).push([[56],{275:function(e,t,a){},352:function(e,t,a){"use strict";a.r(t);var n=a(26),r=(a(275),a(7)),i=a(119),s=a(0),c=a.n(s),u=a(198),o=a(142),v=a(168),l=a(140),b=a(169),p=a(157),w=function(e){Object(s.useEffect)(function(e){return function(){var t=u.b.subscribe(e);return u.b.init(),function(){t.unsubscribe()}}}(e),[])},g=function(e,t){var a=t.previousMalId;Object(s.useEffect)(function(e){return function(){0!==u.b.currentState().reviewsData.length&&u.b.currentState().previousMalId===e||u.b.updateData({shouldUpdatePageReviewData:!0,reviewsData:[],pageReviewsData:1,pageSplit:1,isStopFetchingReviews:null,pageReviewsOnDestroy:null})}}(e),[e,a])},f=function(e){var t=e.pageReviewsData,a=e.shouldUpdatePageReviewData;Object(s.useEffect)(function(e){return function(){var t=Object(u.c)().subscribe((function(){e&&u.b.currentState().pageSplit>u.b.currentState().reviewsData.length&&(parseInt(u.b.currentState().reviewsData.length/20+1)!==u.b.currentState().reviewsData.length/20+1?u.b.updateData({isStopFetchingReviews:!0}):u.b.updateData({pageReviewsData:u.b.currentState().reviewsData.length/20+1}))}));return function(){t&&t.unsubscribe()}}}(a),[t,a])},D=function(e,t,a){var n=e.pageReviewsData,r=e.reviewsData;Object(s.useEffect)(function(e,t,a,n){return function(){var r=Object(o.a)(0).pipe(Object(v.a)((function(){return u.b.currentState().pageReviewsOnDestroy!==e&&!1===u.b.currentState().isStopFetchingReviews})),Object(l.a)((function(){return u.b.currentState().pageReviewsData>1})),Object(b.a)(Object(u.a)(a,u.b.currentState().pageReviewsData,n))).subscribe((function(e){if(e&&!e.error){var n;if(n=0===u.b.currentState().reviewsData.length||u.b.currentState().previousMalId!==a?e:t.concat(e),0===e.length)return void u.b.updateData({isStopFetchingReviews:!0});u.b.updateData({reviewsData:n,previousMalId:a,pageReviewsOnDestroy:u.b.currentState().pageReviewsData,shouldUpdatePageReviewData:!0}),n.length>0&&p.a.updateData({malId:p.a.currentState().malId})}else u.b.updateData({isStopFetchingReviews:!0,shouldUpdatePageReviewData:!1})}));return function(){r.unsubscribe()}}}(n,r,t,a),[t,n])},d=Object(r.a)((function(){return a.e(40).then(a.bind(null,344))}));t.default=function(e){var t=e.malId,a=e.type,r=Object(s.useState)(u.b.currentState()),o=Object(n.a)(r,2),v=o[0],l=o[1];return w(l),g(t,v),f(v),D(v,t,a),c.a.createElement("div",{className:"container-reviews",style:{boxShadow:0===v.reviewsData.length&&"none"}},(!1===v.isStopFetchingReviews||v&&v.reviewsData.length>0)&&c.a.createElement("h1",{className:"title"},"Reviews"),v&&0===v.reviewsData.length&&!1===v.isStopFetchingReviews&&c.a.createElement("div",{className:"loading-symbol-review"},c.a.createElement(i.a,{color:"secondary",size:"3rem"})),v&&v.reviewsData.length>0&&c.a.createElement("div",{className:"reviews-list-container"},v&&v.reviewsData.slice(0,v.pageSplit).map((function(e,t){return c.a.createElement(d,{type:a,key:t,review:e})})),v&&!v.isStopFetchingReviews&&c.a.createElement("div",{className:"loading-symbol-review"},c.a.createElement(i.a,{color:"secondary",size:"3rem"}))))}}}]);
//# sourceMappingURL=56.68151ae9.chunk.js.map