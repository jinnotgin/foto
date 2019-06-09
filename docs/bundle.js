var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function i(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function c(t,n){t.appendChild(n)}function a(t,n,e){t.insertBefore(n,e||null)}function s(t){t.parentNode.removeChild(t)}function u(t){return document.createElement(t)}function l(t){return document.createTextNode(t)}function d(){return l(" ")}function f(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function g(t,n){n=""+n,t.data!==n&&(t.data=n)}let m;function p(t){m=t}function $(t){(function(){if(!m)throw new Error("Function called outside component initialization");return m})().$$.on_mount.push(t)}const h=[],y=Promise.resolve();let S=!1;const v=[],b=[],x=[];function _(t){b.push(t)}function I(){const t=new Set;do{for(;h.length;){const t=h.shift();p(t),w(t.$$)}for(;v.length;)v.shift()();for(;b.length;){const n=b.pop();t.has(n)||(n(),t.add(n))}}while(h.length);for(;x.length;)x.pop()();S=!1}function w(t){t.fragment&&(t.update(t.dirty),o(t.before_render),t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_render.forEach(_))}function E(t,e,i){const{fragment:c,on_mount:a,on_destroy:s,after_render:u}=t.$$;c.m(e,i),_(()=>{const e=a.map(n).filter(r);s?s.push(...e):o(e),t.$$.on_mount=[]}),u.forEach(_)}function P(t,n){t.$$.dirty||(h.push(t),S||(S=!0,y.then(I)),t.$$.dirty=e()),t.$$.dirty[n]=!0}function A(n,r,i,c,a,s){const u=m;p(n);const l=r.props||{},d=n.$$={fragment:null,ctx:null,props:s,update:t,not_equal:a,bound:e(),on_mount:[],on_destroy:[],before_render:[],after_render:[],context:new Map(u?u.$$.context:[]),callbacks:e(),dirty:null};let f=!1;var g;d.ctx=i?i(n,l,(t,e)=>{d.ctx&&a(d.ctx[t],d.ctx[t]=e)&&(d.bound[t]&&d.bound[t](e),f&&P(n,t))}):l,d.update(),f=!0,o(d.before_render),d.fragment=c(d.ctx),r.target&&(r.hydrate?d.fragment.l((g=r.target,Array.from(g.childNodes))):d.fragment.c(),r.intro&&n.$$.fragment.i&&n.$$.fragment.i(),E(n,r.target,r.anchor),I()),p(u)}class C{$destroy(){var n,e;e=!0,(n=this).$$&&(o(n.$$.on_destroy),n.$$.fragment.d(e),n.$$.on_destroy=n.$$.fragment=null,n.$$.ctx={}),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(){}}const k=function(n,e=t){let o;const r=[];function c(t){if(i(n,t)){if(n=t,!o)return;r.forEach(t=>t[1]()),r.forEach(t=>t[0](n))}}return{set:c,update:function(t){c(t(n))},subscribe:function(i,a=t){const s=[i,a];return r.push(s),1===r.length&&(o=e(c)||t),i(n),()=>{const t=r.indexOf(s);-1!==t&&r.splice(t,1),0===r.length&&o()}}}}([]),L={API_KEY:"AIzaSyCAr4_7aSMmQ4kLnR5cbqnCYbLdPPtw2Hw",CLIENT_ID:"273033434753-laf0qm75cehad2f7p7uuv8ppnvq6753a.apps.googleusercontent.com"};function N(t){var n,e,o,r;return{c(){(n=u("h1")).textContent="You are not authenticated.",e=d(),(o=u("button")).textContent="authorize and load",r=f(o,"click",t.click_handler)},m(t,r){a(t,n,r),a(t,e,r),a(t,o,r)},d(t){t&&(s(n),s(e),s(o)),r()}}}function T(n){return{c:t,m:t,d:t}}function q(n){var e,o;function r(t){return t.googlePhotosClientLoaded?T:N}var i=r(n),c=i(n);return{c(){e=u("div"),c.c(),e.className="content svelte-1p2f574",o=f(e,"click",n.displayRandomPhoto)},m(t,n){a(t,e,n),c.m(e,null)},p(t,n){i!==(i=r(n))&&(c.d(1),(c=i(n))&&(c.c(),c.m(e,null)))},i:t,o:t,d(t){t&&s(e),c.d(),o()}}}const M=30;function D(t,n,e){let o;!function(t,n,e){const o=n.subscribe(e);t.$$.on_destroy.push(o.unsubscribe?()=>o.unsubscribe():o)}(t,k,t=>{e("$photos",o=t)});let r=!1;function i(){return gapi.client.setApiKey(L.API_KEY),gapi.client.load("https://content.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest").then(function(){e("googlePhotosClientLoaded",r=!0),console.log("GAPI client loaded for API"),l()},function(t){console.error("Error loading GAPI client for API",t)})}function c(){const t=Math.round(Math.random()*o.length);!function(t){const n=new Image;n.onload=function(){document.querySelector("html").style.backgroundImage=`url(${n.src})`},n.src=t}(`${o[t].baseUrl}=w0-h0`),u()}let a,s="";const u=()=>{clearInterval(a),a=setTimeout(l,1e3*M)};function l(){return gapi.client.photoslibrary.mediaItems.search({resource:{pageSize:25,pageToken:s}}).then(function(t){console.log("Response",t);const{result:n}=t;k.update(t=>Array.from(new Set([...t,...n.mediaItems]))),s=n.nextPageToken,c()},function(t){console.error("Execute error",t),u()})}return gapi.load("client:auth2",function(){gapi.auth2.init({client_id:L.CLIENT_ID}).then(()=>{gapi.auth2.getAuthInstance().isSignedIn.get()&&i()})}),t.$$.update=((t={$photos:1})=>{t.$photos&&console.log(o)}),{googlePhotosClientLoaded:r,loadClient:i,displayRandomPhoto:c,click_handler:function(){return function(){const t=gapi.auth2.getAuthInstance();return t.isSignedIn.get()?console.log("User already signed in."):t.signIn({scope:"https://www.googleapis.com/auth/photoslibrary.readonly"}).then(function(){console.log("Sign-in successful")},function(t){console.error("Error signing in",t)}),t}().then(i)}}}class z extends C{constructor(t){super(),A(this,t,D,q,i,[])}}function O(n){var e,o;return{c(){e=u("div"),o=l(n.timeString),e.className="svelte-5q5vyy"},m(t,n){a(t,e,n),c(e,o)},p(t,n){t.timeString&&g(o,n.timeString)},i:t,o:t,d(t){t&&s(e)}}}function R(t,n,e){let{timeString:o="0:00"}=n;return t.$set=(t=>{"timeString"in t&&e("timeString",o=t.timeString)}),{timeString:o}}class Y extends C{constructor(t){super(),A(this,t,R,O,i,["timeString"])}}function F(n){var e,o;return{c(){e=u("div"),o=l(n.photoSlogan),e.className="svelte-1so9xd0"},m(t,n){a(t,e,n),c(e,o)},p(t,n){t.photoSlogan&&g(o,n.photoSlogan)},i:t,o:t,d(t){t&&s(e)}}}function K(t,n,e){let{photoSlogan:o=""}=n;return t.$set=(t=>{"photoSlogan"in t&&e("photoSlogan",o=t.photoSlogan)}),{photoSlogan:o}}class j extends C{constructor(t){super(),A(this,t,K,F,i,["photoSlogan"])}}function G(t){var n,e,o,r=new Y({props:{timeString:t.timeString}}),i=new j({props:{photoSlogan:t.dateString}});return{c(){n=u("div"),r.$$.fragment.c(),e=d(),i.$$.fragment.c(),n.className="svelte-m3u4ae"},m(t,s){a(t,n,s),E(r,n,null),c(n,e),E(i,n,null),o=!0},p(t,n){var e={};t.timeString&&(e.timeString=n.timeString),r.$set(e);var o={};t.dateString&&(o.photoSlogan=n.dateString),i.$set(o)},i(t){o||(r.$$.fragment.i(t),i.$$.fragment.i(t),o=!0)},o(t){r.$$.fragment.o(t),i.$$.fragment.o(t),o=!1},d(t){t&&s(n),r.$destroy(),i.$destroy()}}}function H(t,n,e){let o=new Date;$(()=>{setInterval(()=>{e("time",o=new Date)},1e3)});let r,i;return t.$$.update=((t={time:1})=>{t.time&&e("timeString",r=(t=>{let n=t.getHours();return 0===n?n=12:n>12&&(n-=12),`${n}:${t.getMinutes().toString().padStart(2,"0")}`})(o)),t.time&&e("dateString",i=(t=>{const n=t.toDateString().split(" "),e=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],o=e.map(t=>t.substr(0,3));return`${e[o.indexOf(n[0])]}, ${n[1]} ${n[2]}`})(o))}),{timeString:r,dateString:i}}class U extends C{constructor(t){super(),A(this,t,H,G,i,[])}}function B(n){var e,o,r=new z({}),i=new U({});return{c(){r.$$.fragment.c(),e=d(),i.$$.fragment.c()},m(t,n){E(r,t,n),a(t,e,n),E(i,t,n),o=!0},p:t,i(t){o||(r.$$.fragment.i(t),i.$$.fragment.i(t),o=!0)},o(t){r.$$.fragment.o(t),i.$$.fragment.o(t),o=!1},d(t){r.$destroy(t),t&&s(e),i.$destroy(t)}}}function Q(t,n,e){let{name:o}=n;return t.$set=(t=>{"name"in t&&e("name",o=t.name)}),{name:o}}return new class extends C{constructor(t){super(),A(this,t,Q,B,i,["name"])}}({target:document.body,props:{name:"Foto"}})}();
//# sourceMappingURL=bundle.js.map
