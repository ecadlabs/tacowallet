(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{WAHi:function(t,n,i){"use strict";i.r(n),i.d(n,"ListPageModule",(function(){return j}));var o=i("ofXK"),c=i("3Pt+"),e=i("TEn/"),r=i("tyNb"),s=i("mrSG"),a=i("7OIR"),b=i("eIep"),u=i("flj8"),p=i("2E/j"),l=i("c3o+"),m=i("fXoL");function f(t,n){1&t&&m.Kb(0,"ion-icon",6)}function d(t,n){1&t&&m.Kb(0,"ion-spinner",7)}function h(t,n){1&t&&m.Kb(0,"ion-icon",8)}function g(t,n){if(1&t&&(m.Mb(0,"ion-item"),m.jc(1),m.Lb()),2&t){const t=n.$implicit,i=m.Wb(2);m.zb(1),m.lc(" ",i.getStrTemplate(t)," ")}}function v(t,n){if(1&t){const t=m.Nb();m.Mb(0,"ion-button",9),m.Ub("click",(function(){m.fc(t);const n=m.Wb().$implicit;return m.Wb().approve(n)})),m.jc(1,"Approve"),m.Lb()}}function y(t,n){if(1&t){const t=m.Nb();m.Mb(0,"ion-button",9),m.Ub("click",(function(){m.fc(t);const n=m.Wb().$implicit;return m.Wb().showSummary(n)})),m.jc(1,"Show"),m.Lb()}}function I(t,n){if(1&t&&(m.Mb(0,"ion-item"),m.ic(1,f,1,0,"ion-icon",1),m.ic(2,d,1,0,"ion-spinner",2),m.ic(3,h,1,0,"ion-icon",3),m.Mb(4,"ion-label"),m.Mb(5,"ion-list",4),m.ic(6,g,2,1,"ion-item",0),m.Lb(),m.Lb(),m.ic(7,v,2,0,"ion-button",5),m.ic(8,y,2,0,"ion-button",5),m.Lb()),2&t){const t=n.$implicit,i=m.Wb();m.zb(1),m.bc("ngIf","need_approval"===t.status),m.zb(1),m.bc("ngIf","pending"===t.status),m.zb(1),m.bc("ngIf","completed"===t.status),m.zb(3),m.bc("ngForOf",t.ops),m.zb(1),m.bc("ngIf","need_approval"===t.status),m.zb(1),m.bc("ngIf","pending"===t.status&&i.hasSummary(t))}}let S=(()=>{class t{constructor(t,n,i){this.account=t,this.operationApprover=n,this.summaryService=i,this.txList$=this.account.currentAccount$.pipe(Object(b.a)(t=>t.operationRequest$))}getStrTemplate(t){const n=new a.a("https://api.tez.ie/rpc/delphinet");return`${t.kind} To: ${t.destination} Amount: ${n.format("mutez","tz",t.amount).toString()} tz`}showSummary(t){return Object(s.a)(this,void 0,void 0,(function*(){this.summaryService.call(t.appID,t.tx)}))}hasSummary(t){return this.summaryService.hasSummary(t.appID)}approve(t){return Object(s.a)(this,void 0,void 0,(function*(){yield this.operationApprover.approve(t)}))}ngOnInit(){}}return t.\u0275fac=function(n){return new(n||t)(m.Jb(u.a),m.Jb(p.a),m.Jb(l.a))},t.\u0275cmp=m.Db({type:t,selectors:[["app-list"]],decls:3,vars:3,consts:[[4,"ngFor","ngForOf"],["name","information-circle-outline","slot","start",4,"ngIf"],["slot","start","name","dots",4,"ngIf"],["name","checkmark-circle-outline","slot","start",4,"ngIf"],["lines","none"],[3,"click",4,"ngIf"],["name","information-circle-outline","slot","start"],["slot","start","name","dots"],["name","checkmark-circle-outline","slot","start"],[3,"click"]],template:function(t,n){1&t&&(m.Mb(0,"ion-list"),m.ic(1,I,9,6,"ion-item",0),m.Xb(2,"async"),m.Lb()),2&t&&(m.zb(1),m.bc("ngForOf",m.Yb(2,1,n.txList$)))},directives:[e.k,o.i,e.i,o.j,e.j,e.g,e.p,e.c],pipes:[o.b],styles:[""]}),t})(),j=(()=>{class t{}return t.\u0275mod=m.Hb({type:t}),t.\u0275inj=m.Gb({factory:function(n){return new(n||t)},imports:[[o.c,c.a,e.v,r.j.forChild([{path:"",component:S}])]]}),t})()}}]);