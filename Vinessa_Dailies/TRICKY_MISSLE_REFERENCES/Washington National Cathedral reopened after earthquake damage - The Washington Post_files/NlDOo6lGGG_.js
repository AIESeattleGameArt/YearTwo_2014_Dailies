/*!CK:3835652056!*//*1380751870,179331367*/

if (self.CavalryLogger) { CavalryLogger.start_js(["y1+sy"]); }

__d("legacy:onload-action",["OnloadHooks"],function(a,b,c,d){var e=b('OnloadHooks');a._onloadHook=e._onloadHook;a._onafterloadHook=e._onafterloadHook;a.runHook=e.runHook;a.runHooks=e.runHooks;a.keep_window_set_as_loaded=e.keepWindowSetAsLoaded;},3);
__d("EagleEye",["Arbiter","Env","OnloadEvent","WebStorage","isInIframe"],function(a,b,c,d,e,f){var g=b('Arbiter'),h=b('Env'),i=b('OnloadEvent'),j=b('WebStorage'),k=b('isInIframe'),l=h.eagleEyeConfig||{},m='_e_',n=(window.name||'').toString();if(n.length==7&&n.substr(0,3)==m){n=n.substr(3);}else{n=l.seed;if(!k())window.name=m+n;}var o=(window.location.protocol=='https:'&&document.cookie.match(/\bcsm=1/))?'; secure':'',p=m+n+'_',q=new Date(Date.now()+604800000).toGMTString(),r=window.location.hostname.replace(/^.*(facebook\..*)$/i,'$1'),s='; expires='+q+';path=/; domain='+r+o,t=0,u,v=l.sessionStorage&&j.getSessionStorage(),w=document.cookie.length,x=false,y=Date.now();function z(da){return p+(t++)+'='+encodeURIComponent(da)+s;}function aa(){var da=[],ea=false,fa=0,ga=0;this.isEmpty=function(){return !da.length;};this.enqueue=function(ha,ia){if(ia){da.unshift(ha);}else da.push(ha);};this.dequeue=function(){da.shift();};this.peek=function(){return da[0];};this.clear=function(ha){w=Math.min(w,document.cookie.length);if(!x&&(new Date()-y>60000))x=true;var ia=!ha&&(document.cookie.search(m)>=0),ja=!!h.cookie_header_limit,ka=h.cookie_count_limit||19,la=h.cookie_header_limit||3950,ma=ka-5,na=la-1000;while(!this.isEmpty()){var oa=z(this.peek());if(ja&&(oa.length>la||(x&&oa.length+w>la))){this.dequeue();continue;}if((ia||ja)&&((document.cookie.length+oa.length>la)||(document.cookie.split(';').length>ka)))break;document.cookie=oa;ia=true;this.dequeue();}var pa=Date.now();if(ha||!ea&&ia&&((ga>0)&&(Math.min(10*Math.pow(2,ga-1),60000)+fa<pa))&&g.query(i.ONLOAD)&&(!this.isEmpty()||(document.cookie.length>na)||(document.cookie.split(';').length>ma))){var qa=new Image(),ra=this,sa=h.tracking_domain||'';ea=true;qa.onload=function va(){ea=false;ga=0;ra.clear();};qa.onerror=qa.onabort=function va(){ea=false;fa=Date.now();ga++;};var ta=h.fb_isb?'&fb_isb='+h.fb_isb:'',ua='&__user='+h.user;qa.src=sa+'/ajax/nectar.php?asyncSignal='+(Math.floor(Math.random()*10000)+1)+ta+ua+'&'+(!ha?'':'s=')+pa;}};}u=new aa();if(v){var ba=function(){var da=0,ea=da;function fa(){var ia=sessionStorage.getItem('_e_ids');if(ia){var ja=(ia+'').split(';');if(ja.length==2){da=parseInt(ja[0],10);ea=parseInt(ja[1],10);}}}function ga(){var ia=da+';'+ea;sessionStorage.setItem('_e_ids',ia);}function ha(ia){return '_e_'+((ia!==undefined)?ia:da++);}this.isEmpty=function(){return ea===da;};this.enqueue=function(ia,ja){var ka=ja?ha(--ea):ha();sessionStorage.setItem(ka,ia);ga();};this.dequeue=function(){this.isEmpty();sessionStorage.removeItem(ha(ea));ea++;ga();};this.peek=function(){var ia=sessionStorage.getItem(ha(ea));return ia?(ia+''):ia;};this.clear=u.clear;fa();};u=new ba();}var ca={log:function(da,ea,fa){if(h.no_cookies)return;var ga=[n,Date.now(),da].concat(ea);ga.push(ga.length);function ha(){var ia=JSON.stringify(ga);try{u.enqueue(ia,!!fa);u.clear(!!fa);}catch(ja){if(v&&(ja.code===1000)){u=new aa();v=false;ha();}}}ha();},getSessionID:function(){return n;}};e.exports=ca;a.EagleEye=ca;},3);
__d("ClickRefUtils",[],function(a,b,c,d,e,f){var g={get_intern_ref:function(h){if(!!h){var i={profile_minifeed:1,gb_content_and_toolbar:1,gb_muffin_area:1,ego:1,bookmarks_menu:1,jewelBoxNotif:1,jewelNotif:1,BeeperBox:1,navSearch:1};for(var j=h;j&&j!=document.body;j=j.parentNode){if(!j.id||typeof j.id!=='string')continue;if(j.id.substr(0,8)=='pagelet_')return j.id.substr(8);if(j.id.substr(0,8)=='box_app_')return j.id;if(i[j.id])return j.id;}}return '-';},get_href:function(h){var i=(h.getAttribute&&(h.getAttribute('ajaxify')||h.getAttribute('data-endpoint'))||h.action||h.href||h.name);return typeof i==='string'?i:null;},should_report:function(h,i){if(i=='FORCE')return true;if(i=='INDIRECT')return false;return h&&(g.get_href(h)||(h.getAttribute&&h.getAttribute('data-ft')));}};e.exports=g;});
__d("getContextualParent",["ge"],function(a,b,c,d,e,f){var g=b('ge');function h(i,j){var k,l=false;do{if(i.getAttribute&&(k=i.getAttribute('data-ownerid'))){i=g(k);l=true;}else i=i.parentNode;}while(j&&i&&!l);return i;}e.exports=h;});
__d("collectDataAttributes",["getContextualParent"],function(a,b,c,d,e,f){var g=b('getContextualParent');function h(i,j){var k={},l={},m=j.length,n;for(n=0;n<m;++n){k[j[n]]={};l[j[n]]='data-'+j[n];}var o={tn:'',"tn-debug":','};while(i){if(i.getAttribute)for(n=0;n<m;++n){var p=i.getAttribute(l[j[n]]);if(p){var q=JSON.parse(p);for(var r in q)if(o[r]!==undefined){if(k[j[n]][r]===undefined)k[j[n]][r]=[];k[j[n]][r].push(q[r]);}else if(k[j[n]][r]===undefined)k[j[n]][r]=q[r];}}i=g(i);}for(var s in k)for(var t in o)if(k[s][t]!==undefined)k[s][t]=k[s][t].join(o[t]);return k;}e.exports=h;});
__d("setUECookie",["Env"],function(a,b,c,d,e,f){var g=b('Env');function h(i){if(!g.no_cookies)document.cookie="act="+encodeURIComponent(i)+"; path=/; domain="+window.location.hostname.replace(/^.*(\.facebook\..*)$/i,'$1');}e.exports=h;});
__d("ClickRefLogger",["Arbiter","ClickRefUtils","EagleEye","Vector","$","collectDataAttributes","copyProperties","ge","pageID","setUECookie"],function(a,b,c,d,e,f){var g=b('Arbiter'),h=b('ClickRefUtils'),i=b('EagleEye'),j=b('Vector'),k=b('$'),l=b('collectDataAttributes'),m=b('copyProperties'),n=b('ge'),o=b('pageID'),p=b('setUECookie');function q(s){if(!n('content'))return [0,0,0,0];var t=k('content'),u=j.getEventPosition(s);return [u.x,u.y,t.offsetLeft,t.clientWidth];}function r(s,t,event,u){var v='r',w=[0,0,0,0],x,y;if(!!event){x=event.type;if(x=='click'&&n('content'))w=q(event);var z=0;event.ctrlKey&&(z+=1);event.shiftKey&&(z+=2);event.altKey&&(z+=4);event.metaKey&&(z+=8);if(z)x+=z;}if(!!t)y=h.get_href(t);var aa=l(!!event?(event.target||event.srcElement):t,['ft','gt']);m(aa.ft,u.ft||{});m(aa.gt,u.gt||{});if(typeof(aa.ft.ei)==='string')delete aa.ft.ei;var ba=[s._ue_ts,s._ue_count,y||'-',s._context,x||'-',h.get_intern_ref(t),v,a.URI?a.URI.getRequestURI(true,true).getUnqualifiedURI().toString():location.pathname+location.search+location.hash,aa].concat(w).concat(o);return ba;}g.subscribe("ClickRefAction/new",function(s,t){if(h.should_report(t.node,t.mode)){var u=r(t.cfa,t.node,t.event,t.extra_data);p(t.cfa.ue);i.log('act',u);}});});
__d("PostLoadJS",["Bootloader","Run","emptyFunction"],function(a,b,c,d,e,f){var g=b('Bootloader'),h=b('Run'),i=b('emptyFunction');function j(l,m){h.onAfterLoad(function(){g.loadModules.call(g,[l],m);});}var k={loadAndRequire:function(l){j(l,i);},loadAndCall:function(l,m,n){j(l,function(o){o[m].apply(o,n);});}};e.exports=k;});
__d("ScriptPathState",["Arbiter"],function(a,b,c,d,e,f){var g=b('Arbiter'),h,i,j,k,l=100,m={setIsUIPageletRequest:function(n){j=n;},setUserURISampleRate:function(n){k=n;},reset:function(){h=null;i=false;j=false;},_shouldUpdateScriptPath:function(){return (i&&!j);},_shouldSendURI:function(){return (Math.random()<k);},getParams:function(){var n={};if(m._shouldUpdateScriptPath()){if(m._shouldSendURI()&&h!==null)n.user_uri=h.substring(0,l);}else n.no_script_path=1;return n;}};g.subscribe("pre_page_transition",function(n,o){i=true;h=o.to.getUnqualifiedURI().toString();});e.exports=a.ScriptPathState=m;});
__d("UserActionHistory",["Arbiter","ClickRefUtils","ScriptPath","throttle","WebStorage"],function(a,b,c,d,e,f){var g=b('Arbiter'),h=b('ClickRefUtils'),i=b('ScriptPath'),j=b('throttle'),k=b('WebStorage'),l={click:1,submit:1},m=false,n={log:[],len:0},o=j.acrossTransitions(function(){try{m._ua_log=JSON.stringify(n);}catch(r){m=false;}},1000);function p(){var r=k.getSessionStorage();if(r){m=r;m._ua_log&&(n=JSON.parse(m._ua_log));}else m=false;n.log[n.len%10]={ts:Date.now(),path:'-',index:n.len,type:'init',iref:'-'};n.len++;g.subscribe("UserAction/new",function(s,t){var u=t.ua,v=t.node,event=t.event;if(!event||!(event.type in l))return;var w={path:i.getScriptPath(),type:event.type,ts:u._ue_ts,iref:h.get_intern_ref(v)||'-',index:n.len};n.log[n.len++%10]=w;m&&o();});}function q(){return n.log.sort(function(r,s){return (s.ts!=r.ts)?(s.ts-r.ts):(s.index-r.index);});}p();e.exports={getHistory:q};});