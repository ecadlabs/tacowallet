function _classCallCheck(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(n,t){for(var e=0;e<t.length;e++){var i=t[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(n,i.key,i)}}function _createClass(n,t,e){return t&&_defineProperties(n.prototype,t),e&&_defineProperties(n,e),n}(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{WAHi:function(n,t,e){"use strict";e.r(t),e.d(t,"ListPageModule",(function(){return S}));var i=e("ofXK"),o=e("3Pt+"),r=e("TEn/"),c=e("tyNb"),a=e("mrSG"),s=e("7OIR"),u=e("eIep"),p=e("flj8"),l=e("2E/j"),f=e("c3o+"),b=e("fXoL");function m(n,t){1&n&&b.Kb(0,"ion-icon",6)}function v(n,t){1&n&&b.Kb(0,"ion-spinner",7)}function h(n,t){1&n&&b.Kb(0,"ion-icon",8)}function d(n,t){if(1&n&&(b.Mb(0,"ion-item"),b.jc(1),b.Lb()),2&n){var e=t.$implicit,i=b.Wb(2);b.zb(1),b.lc(" ",i.getStrTemplate(e)," ")}}function g(n,t){if(1&n){var e=b.Nb();b.Mb(0,"ion-button",9),b.Ub("click",(function(){b.fc(e);var n=b.Wb().$implicit;return b.Wb().approve(n)})),b.jc(1,"Approve"),b.Lb()}}function k(n,t){if(1&n){var e=b.Nb();b.Mb(0,"ion-button",9),b.Ub("click",(function(){b.fc(e);var n=b.Wb().$implicit;return b.Wb().showSummary(n)})),b.jc(1,"Show"),b.Lb()}}function y(n,t){if(1&n&&(b.Mb(0,"ion-item"),b.ic(1,m,1,0,"ion-icon",1),b.ic(2,v,1,0,"ion-spinner",2),b.ic(3,h,1,0,"ion-icon",3),b.Mb(4,"ion-label"),b.Mb(5,"ion-list",4),b.ic(6,d,2,1,"ion-item",0),b.Lb(),b.Lb(),b.ic(7,g,2,0,"ion-button",5),b.ic(8,k,2,0,"ion-button",5),b.Lb()),2&n){var e=t.$implicit,i=b.Wb();b.zb(1),b.bc("ngIf","need_approval"===e.status),b.zb(1),b.bc("ngIf","pending"===e.status),b.zb(1),b.bc("ngIf","completed"===e.status),b.zb(3),b.bc("ngForOf",e.ops),b.zb(1),b.bc("ngIf","need_approval"===e.status),b.zb(1),b.bc("ngIf","pending"===e.status&&i.hasSummary(e))}}var w,I,j=((I=function(){function n(t,e,i){_classCallCheck(this,n),this.account=t,this.operationApprover=e,this.summaryService=i,this.txList$=this.account.currentAccount$.pipe(Object(u.a)((function(n){return n.operationRequest$})))}return _createClass(n,[{key:"getStrTemplate",value:function(n){var t=new s.a("https://api.tez.ie/rpc/delphinet");return"".concat(n.kind," To: ").concat(n.destination," Amount: ").concat(t.format("mutez","tz",n.amount).toString()," tz")}},{key:"showSummary",value:function(n){return Object(a.a)(this,void 0,void 0,regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this.summaryService.call(n.appID,n.tx);case 1:case"end":return t.stop()}}),t,this)})))}},{key:"hasSummary",value:function(n){return this.summaryService.hasSummary(n.appID)}},{key:"approve",value:function(n){return Object(a.a)(this,void 0,void 0,regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.operationApprover.approve(n);case 2:case"end":return t.stop()}}),t,this)})))}},{key:"ngOnInit",value:function(){}}]),n}()).\u0275fac=function(n){return new(n||I)(b.Jb(p.a),b.Jb(l.a),b.Jb(f.a))},I.\u0275cmp=b.Db({type:I,selectors:[["app-list"]],decls:3,vars:3,consts:[[4,"ngFor","ngForOf"],["name","information-circle-outline","slot","start",4,"ngIf"],["slot","start","name","dots",4,"ngIf"],["name","checkmark-circle-outline","slot","start",4,"ngIf"],["lines","none"],[3,"click",4,"ngIf"],["name","information-circle-outline","slot","start"],["slot","start","name","dots"],["name","checkmark-circle-outline","slot","start"],[3,"click"]],template:function(n,t){1&n&&(b.Mb(0,"ion-list"),b.ic(1,y,9,6,"ion-item",0),b.Xb(2,"async"),b.Lb()),2&n&&(b.zb(1),b.bc("ngForOf",b.Yb(2,1,t.txList$)))},directives:[r.k,i.i,r.i,i.j,r.j,r.g,r.p,r.c],pipes:[i.b],styles:[""]}),I),S=((w=function n(){_classCallCheck(this,n)}).\u0275mod=b.Hb({type:w}),w.\u0275inj=b.Gb({factory:function(n){return new(n||w)},imports:[[i.c,o.a,r.v,c.j.forChild([{path:"",component:j}])]]}),w)}}]);