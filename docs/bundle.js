var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function a(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function s(t,e,n){const o=e.subscribe(n);t.$$.on_destroy.push(o.unsubscribe?()=>o.unsubscribe():o)}function c(t,e){t.appendChild(e)}function i(t,e,n){t.insertBefore(e,n||null)}function l(t){t.parentNode.removeChild(t)}function u(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function h(){return d(" ")}function g(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function m(t,e){e=""+e,t.data!==e&&(t.data=e)}let f;function p(t){f=t}function $(t){(function(){if(!f)throw new Error("Function called outside component initialization");return f})().$$.on_mount.push(t)}const y=[],w=Promise.resolve();let _=!1;const v=[],b=[],P=[];function S(t){b.push(t)}function I(){const t=new Set;do{for(;y.length;){const t=y.shift();p(t),x(t.$$)}for(;v.length;)v.shift()();for(;b.length;){const e=b.pop();t.has(e)||(e(),t.add(e))}}while(y.length);for(;P.length;)P.pop()();_=!1}function x(t){t.fragment&&(t.update(t.dirty),o(t.before_render),t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_render.forEach(S))}function E(t,n,a){const{fragment:s,on_mount:c,on_destroy:i,after_render:l}=t.$$;s.m(n,a),S(()=>{const n=c.map(e).filter(r);i?i.push(...n):o(n),t.$$.on_mount=[]}),l.forEach(S)}function N(t,e){t.$$.dirty||(y.push(t),_||(_=!0,w.then(I)),t.$$.dirty=n()),t.$$.dirty[e]=!0}function A(e,r,a,s,c,i){const l=f;p(e);const u=r.props||{},d=e.$$={fragment:null,ctx:null,props:i,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],before_render:[],after_render:[],context:new Map(l?l.$$.context:[]),callbacks:n(),dirty:null};let h=!1;var g;d.ctx=a?a(e,u,(t,n)=>{d.ctx&&c(d.ctx[t],d.ctx[t]=n)&&(d.bound[t]&&d.bound[t](n),h&&N(e,t))}):u,d.update(),h=!0,o(d.before_render),d.fragment=s(d.ctx),r.target&&(r.hydrate?d.fragment.l((g=r.target,Array.from(g.childNodes))):d.fragment.c(),r.intro&&e.$$.fragment.i&&e.$$.fragment.i(),E(e,r.target,r.anchor),I()),p(l)}class k{$destroy(){var e,n;n=!0,(e=this).$$&&(o(e.$$.on_destroy),e.$$.fragment.d(n),e.$$.on_destroy=e.$$.fragment=null,e.$$.ctx={}),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}function M(e,n=t){let o;const r=[];function s(t){if(a(e,t)){if(e=t,!o)return;r.forEach(t=>t[1]()),r.forEach(t=>t[0](e))}}return{set:s,update:function(t){s(t(e))},subscribe:function(a,c=t){const i=[a,c];return r.push(i),1===r.length&&(o=n(s)||t),a(e),()=>{const t=r.indexOf(i);-1!==t&&r.splice(t,1),0===r.length&&o()}}}}const T=M({}),C=M({}),D={API_KEY:"AIzaSyCAr4_7aSMmQ4kLnR5cbqnCYbLdPPtw2Hw",CLIENT_ID:"273033434753-laf0qm75cehad2f7p7uuv8ppnvq6753a.apps.googleusercontent.com",OPENWEATHERMAP_API_KEY:"410463b3935acea56c8171825dbb4440"};async function L(t){return await fetch(t).then(function(t){if(!t.ok)throw Error(t.statusText);return t}).then(e=>(console.log("jFetch success:",{url:t,response:e}),e.json())).catch(e=>(console.error("jFetch error:",{url:t,error:e}),e))}const O={},q=(t,e,n)=>{console.log("scheduleFunction:",{functionName:t,scheduleSeconds:n}),((t,e,n)=>{const o={schedule:()=>{clearInterval(O[t]),O[t]=setTimeout(n.function,n.timeout)}};!1===Object.keys(O).includes(t)&&(O[t]=!1),o[e]()})(t,"schedule",{function:e,timeout:1e3*n})},F=t=>{let e=t.getHours();return 0===e?e=12:e>12&&(e-=12),`${e}:${t.getMinutes().toString().padStart(2,"0")}`},G=(t,e)=>{const n=t.toDateString().split(" "),o=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],r=o.map(t=>t.substr(0,3)),a=o[r.indexOf(n[0])],s=n[1],c=parseInt(n[2]),i=n[3];let l="";return l="dayMonth"===e?`${a}, ${s} ${c}`:`${c} ${s} ${i}`};function j(t){var e,n,o,r;return{c(){(e=u("h1")).textContent="You are not authenticated.",n=h(),(o=u("button")).textContent="authorize and load",r=g(o,"click",t.click_handler)},m(t,r){i(t,e,r),i(t,n,r),i(t,o,r)},d(t){t&&(l(e),l(n),l(o)),r()}}}function R(e){return{c:t,m:t,d:t}}function W(e){var n,r;function a(t){return t.googlePhotosClientLoaded?R:j}var s=a(e),c=s(e);return{c(){n=u("div"),c.c(),n.className="content svelte-1p2f574",r=[g(n,"click",e.click_handler_1),g(n,"dblclick",e.dblclick_handler),g(n,"taphold",e.taphold_handler)]},m(t,e){i(t,n,e),c.m(n,null)},p(t,e){s!==(s=a(e))&&(c.d(1),(c=s(e))&&(c.c(),c.m(n,null)))},i:t,o:t,d(t){t&&l(n),c.d(),o(r)}}}const Y=30,K=60;function U(t,e,n){let o;s(t,C,t=>{n("$currentPhoto",o=t)});let{db:r}=e;console.log({db:r});const a=()=>{const t=gapi.auth2.getAuthInstance();if(t.isSignedIn.get()){var e=t.currentUser.get().getBasicProfile();T.set({name:e.getName(),image:e.getImageUrl()})}};let c=!1;function i(){return a(),gapi.client.setApiKey(D.API_KEY),gapi.client.load("https://content.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest").then(function(){n("googlePhotosClientLoaded",c=!0),console.log("GAPI client loaded, starting up photos functionality..."),async function(){const t=await r.photos.orderBy("modified").reverse().limit(100).toArray(),e=t.reduce((t,e)=>t+e.modified,0)/t.length;console.log("clearOldPhotos:",{newlyUpdatedPhotos:t,averageModifiedTime:e,inactiveTolerance:604800});const n=e-604800,o=await r.photos.where("modified").below(n).delete();console.log("clearOldPhotos:",{deleteTransaction:o})}(),l(0),h(0)},function(t){console.error("Error loading GAPI client for API",t)})}const l=(t=Y)=>q("displayRandomPhoto",u,t);async function u(){const t=await r.photos.count(),e=Math.round(Math.random()*t),n=await r.photos.offset(e).limit(1).first(),a=n.id;return console.log("displayRandomPhoto:",{totalNoOfPhotos:t,randomPhotoIndex:e,randomPhotoItem:n,randomPhotoId:a}),gapi.client.photoslibrary.mediaItems.get({mediaItemId:a}).then(function(t){console.log("Photo data (Google):",t),C.set(t.result),function(t){const e=new Image;e.onload=function(){document.querySelector("html").style.backgroundImage=`url(${e.src})`},e.src=t}(`${o.baseUrl}=w0-h0`),l()},function(t){console.error("Execute error",t),l(0)})}let d="";const h=(t=K)=>q("getPictures",g,t);function g(){return gapi.client.photoslibrary.mediaItems.search({resource:{pageSize:100,pageToken:d}}).then(async function(t){console.log("getPictures: ",t);const{result:e}=t,n=e.mediaItems.filter(t=>{return[t.mimeType.includes("image/"),!1===t.filename.toLowerCase().includes("screenshot")].every(t=>!0===t)}).map(t=>t.id),o=Math.round((new Date).getTime()/1e3);await r.photos.bulkPut(n.map(t=>({id:t,modified:o}))).catch(t=>{console.error("Dexie error",t)}),d=e.nextPageToken,h()},function(t){console.error("Execute error",t),h()})}return gapi.load("client:auth2",function(){gapi.auth2.init({client_id:D.CLIENT_ID}).then(()=>{gapi.auth2.getAuthInstance().isSignedIn.get()&&(console.log("User already signed in."),i())})}),t.$set=(t=>{"db"in t&&n("db",r=t.db)}),{db:r,googlePhotosClientLoaded:c,loadClient:i,schedule_displayRandomPhoto:l,document:document,click_handler:function(){return function(){const t=gapi.auth2.getAuthInstance();return t.isSignedIn.get()?console.log("User already signed in."):t.signIn({scope:"https://www.googleapis.com/auth/photoslibrary.readonly"}).then(function(){console.log("Sign-in successful")},function(t){console.error("Error signing in",t)}),t}().then(i)},click_handler_1:function(){return l(0)},dblclick_handler:function(){return document.body.requestFullscreen()},taphold_handler:function(){return document.body.requestFullscreen()}}}class H extends k{constructor(t){super(),A(this,t,U,W,a,["db"])}}function z(e){var n,o;return{c(){n=u("div"),o=d(e.timeString),n.className="svelte-5q5vyy"},m(t,e){i(t,n,e),c(n,o)},p(t,e){t.timeString&&m(o,e.timeString)},i:t,o:t,d(t){t&&l(n)}}}function B(t,e,n){let{timeString:o="0:00"}=e;return t.$set=(t=>{"timeString"in t&&n("timeString",o=t.timeString)}),{timeString:o}}class Q extends k{constructor(t){super(),A(this,t,B,z,a,["timeString"])}}function J(e){var n,o,r,a,s,g,f=void 0!==e.$currentPhoto.mediaMetadata?e.getPhotoDate(e.$currentPhoto.mediaMetadata.creationTime):"",p=void 0===e.$userProfile.name?"":`Google Photos • ${e.$userProfile.name}`;return{c(){n=u("div"),o=u("p"),r=d(f),a=h(),s=u("p"),g=d(p),o.className="svelte-1r96n1h",s.className="svelte-1r96n1h",n.className="svelte-1r96n1h"},m(t,e){i(t,n,e),c(n,o),c(o,r),c(n,a),c(n,s),c(s,g)},p(t,e){t.$currentPhoto&&f!==(f=void 0!==e.$currentPhoto.mediaMetadata?e.getPhotoDate(e.$currentPhoto.mediaMetadata.creationTime):"")&&m(r,f),t.$userProfile&&p!==(p=void 0===e.$userProfile.name?"":`Google Photos • ${e.$userProfile.name}`)&&m(g,p)},i:t,o:t,d(t){t&&l(n)}}}function V(t,e,n){let o,r;s(t,C,t=>{n("$currentPhoto",o=t)}),s(t,T,t=>{n("$userProfile",r=t)});let{photoSlogan:a=""}=e;return t.$set=(t=>{"photoSlogan"in t&&n("photoSlogan",a=t.photoSlogan)}),{photoSlogan:a,getPhotoDate:t=>G(new Date(t)),$currentPhoto:o,$userProfile:r}}class X extends k{constructor(t){super(),A(this,t,V,J,a,["photoSlogan"])}}function Z(t){var e,n,o;return{c(){(e=u("img")).className="weatherIcon svelte-10tw2xa",e.src=n=t.weather.forecastIcon,e.alt=o=t.weather.forecast},m(t,n){i(t,e,n)},p(t,r){t.weather&&n!==(n=r.weather.forecastIcon)&&(e.src=n),t.weather&&o!==(o=r.weather.forecast)&&(e.alt=o)},d(t){t&&l(e)}}}function tt(e){var n,o,r,a=isNaN(e.weather.temp)?"":`${Math.round(e.weather.temp)}°`,s=e.weather.forecastIcon&&Z(e);return{c(){n=u("div"),s&&s.c(),o=h(),r=d(a),n.className="svelte-10tw2xa"},m(t,e){i(t,n,e),s&&s.m(n,null),c(n,o),c(n,r)},p(t,e){e.weather.forecastIcon?s?s.p(t,e):((s=Z(e)).c(),s.m(n,o)):s&&(s.d(1),s=null),t.weather&&a!==(a=isNaN(e.weather.temp)?"":`${Math.round(e.weather.temp)}°`)&&m(r,a)},i:t,o:t,d(t){t&&l(n),s&&s.d()}}}function et(t,e,n){let o={country:"",temp:0},r={};const a=async(t=r)=>{const{latitude:e,longitude:s,accuracy:c}=t,i={default:{current:`https://api.openweathermap.org/data/2.5/weather?lat=${e}&lon=${s}&appid=${D.OPENWEATHERMAP_API_KEY}`,forecast:`https://api.openweathermap.org/data/2.5/forecast?lat=${e}&lon=${s}&appid=${D.OPENWEATHERMAP_API_KEY}`},singapore:{current:"https://api.data.gov.sg/v1/environment/air-temperature",forecast:"https://api.data.gov.sg/v1/environment/2-hour-weather-forecast"}},l=async()=>{const t=L(i.singapore.current),e=L(i.singapore.forecast);return await Promise.all([t,e]).then(function(t){const e=t[0],n=t[1];console.log("weather_sg - raw values:",{current:e,forecast:n});const o=e.metadata.stations.reduce((t,e,n)=>(!1===t&&(t=!!e.name.toLowerCase().includes("woodlands")&&n),t),!1),r=n.area_metadata.reduce((t,e,n)=>(!1===t&&(t=!!e.name.toLowerCase().includes("woodlands")&&n),t),!1),a=e.items[0].readings[o],s=n.items[0].forecasts[r];console.log("weather_sg - finding closest match:",{current_closest_station_index:o,current_closest:a,forecast_closest_area_index:r,forecast_closest:s});const c={name:s.area,country:"SG",temp:a.value,weather:s.forecast,forecast:s.forecast};return console.log("weather_sg - processed:",{weatherData:c}),c})};let u={};return"SG"===o.country?u=await l():"SG"===(u=await(async()=>{const t=L(i.default.current),e=L(i.default.forecast);return await Promise.all([t,e]).then(function(t){const e=t[0],n=t[1];console.log("weather_owm - raw values:",{current:e,forecast:n});const o={name:e.name,country:e.sys.country,temp:e.main.temp/10,weather:e.weather[0].main,forecast:n.list[0].weather[0].main};return console.log("weather_owm - processed:",{weatherData:o}),o})})()).country&&(console.log("Singapore detected! Changing to Singapore api..."),u=await l()),u.forecastIcon=(t=>{const e=t.toLowerCase();return Object.entries({"partly cloudy night":"partly_cloudy_night","partly cloudy":"partly_cloudy","shower night":"scattered_showers_night",shower:"scattered_showers","partly cloudy night":"partly_cloudy_night","partly cloudy":"partly_cloudy","cloudy night":"mostly_cloudy_night",cloudy:"mostly_cloudy_day","mostly sunny":"mostly_sunny",sunny:"sunny_","mostly clear night":"mostly_clear_night","clear night":"clear_night","isolated thunderstorm night":"isolated_scattered_tstorms_night","isolated thunderstorm":"isolated_scattered_tstorms_day",thunderstorm:"strong_tstorms","heavy rain":"heavy_rain",rain:"showers_rain","shower night":"scattered_showers_night","shower ":"scattered_showers_day"}).reduce((t,[n,o])=>(!1===t&&(t=!!n.split(" ").every(t=>e.includes(t))&&`weather/${o}_light_color_96dp.png`),t),!1)})(u.forecast),((t=36e3)=>q("getWeatherData",a,t))(),n("weather",o=u),u};return $(()=>{"?locationWoodlands"===window.location.search?(console.log("Overwriting user location to Woodlands, Singapore..."),r={accuracy:20,latitude:1.4310824,longitude:103.77629639999999},a()):(()=>new Promise((t,e,n)=>{navigator.geolocation.getCurrentPosition(t,e,n)}).catch(t=>!1))().then(async t=>{const{coords:e}=t;r=e,console.log({coords:e}),a()})}),{weather:o}}class nt extends k{constructor(t){super(),A(this,t,et,tt,a,[])}}function ot(t){var e,n,o,r,a=new Q({props:{timeString:t.timeString}}),s=new nt({}),d=new X({props:{photoSlogan:t.dateString}});return{c(){e=u("div"),a.$$.fragment.c(),n=h(),s.$$.fragment.c(),o=h(),d.$$.fragment.c(),e.className="svelte-m3u4ae"},m(t,l){i(t,e,l),E(a,e,null),c(e,n),E(s,e,null),c(e,o),E(d,e,null),r=!0},p(t,e){var n={};t.timeString&&(n.timeString=e.timeString),a.$set(n);var o={};t.dateString&&(o.photoSlogan=e.dateString),d.$set(o)},i(t){r||(a.$$.fragment.i(t),s.$$.fragment.i(t),d.$$.fragment.i(t),r=!0)},o(t){a.$$.fragment.o(t),s.$$.fragment.o(t),d.$$.fragment.o(t),r=!1},d(t){t&&l(e),a.$destroy(),s.$destroy(),d.$destroy()}}}function rt(t,e,n){let o,r,a=new Date;return $(()=>{setInterval(()=>{n("time",a=new Date)},1e3)}),t.$$.update=((t={time:1})=>{t.time&&n("timeString",o=F(a)),t.time&&n("dateString",r=G(a,"dayMonth"))}),{timeString:o,dateString:r}}class at extends k{constructor(t){super(),A(this,t,rt,ot,a,[])}}function st(t){var e,n,o=new H({props:{db:t.db}}),r=new at({});return{c(){o.$$.fragment.c(),e=h(),r.$$.fragment.c()},m(t,a){E(o,t,a),i(t,e,a),E(r,t,a),n=!0},p(t,e){var n={};t.db&&(n.db=e.db),o.$set(n)},i(t){n||(o.$$.fragment.i(t),r.$$.fragment.i(t),n=!0)},o(t){o.$$.fragment.o(t),r.$$.fragment.o(t),n=!1},d(t){o.$destroy(t),t&&l(e),r.$destroy(t)}}}function ct(t,e,n){let{name:o,version:r}=e;console.log(`Starting ${o} v${r}...`);let{db:a}=e;return n("db",a=new Dexie("fotoDatabase")),a.version(1).stores({photos:"id"}),a.version(2).stores({photos:"id, modified"}),t.$set=(t=>{"name"in t&&n("name",o=t.name),"version"in t&&n("version",r=t.version),"db"in t&&n("db",a=t.db)}),{name:o,version:r,db:a}}return new class extends k{constructor(t){super(),A(this,t,ct,st,a,["name","version","db"])}}({target:document.body,props:{name:"Foto",version:"0.3"}})}();
//# sourceMappingURL=bundle.js.map
