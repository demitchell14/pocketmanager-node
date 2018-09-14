(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{142:function(e,t,a){"use strict";a.r(t);var n=a(1),o=a.n(n);t.default={oninit:function(e){e.state={shadow:"",heading:!1,body:!1},d(e)},view:function(e){return o()("div",{className:`card ${e.state.shadow} ${e.attrs.className||""}`},[e.children.map(e=>"heading"===e.tag?l(e):"body"===e.tag?r(e):"")])}};const l=function(e){return o()("div",{className:`card-heading ${e.attrs&&e.attrs.className||""}`},[o()("div",e.children)])},r=function(e){return o()("div",{className:`card-body ${e.attrs&&e.attrs.className||""}`},[o()("div",e.children)])};let d=function(e){if(e.attrs.shadow)switch(e.attrs.shadow){case"light":e.state.shadow="shadow-lt";break;case"dark":e.state.shadow="shadow-dk";break;default:e.attrs.shadow.includes("shadow")?e.state.shadow=e.attrs.shadow:e.state.shadow="shadow"}}},143:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){return e&&e.__esModule?e:{default:e}}(a(1));t.default={view:function(e){return(0,n.default)("p",{className:"text-muted"},"Breadcrumb Placeholder")}}},146:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){return e&&e.__esModule?e:{default:e}}(a(1)),o=a(2);var l={oninit:function(e){e.state.vendors=[1]},oncreate:function(e){o.vendors.get("vendors").then(function(t){e.state.vendors=t,n.default.redraw()}).catch(function(t){e.state.vendors=[]})},onupdate:function(e){},view:function(e){return(0,n.default)("table",{className:"px-3 mb-0 table table-striped table-hover table-sm"},(0,n.default)("thead",null,(0,n.default)("th",null,"ID"),(0,n.default)("th",null,"Actions"),(0,n.default)("th",null,"Vendor Name"),(0,n.default)("th",null,"Vendor City")),(0,n.default)("tbody",null,e.state.vendors.map(function(e){return r(e)})))}},r=function(e){var t=void 0,a=void 0;switch(window.location.hostname){case"localhost":t=window.location.hostname+":3001/"+e.vendor_city+"/"+e.vendor_name,a="/0/"+e.vendor_city+"/"+e.vendor_name}return(0,n.default)("tr",null,(0,n.default)("td",null,e.vendor_id),(0,n.default)("td",null,(0,n.default)("a",{href:t,className:"btn btn-sm btn-success mr-1"},"View"),(0,n.default)("a",{oncreate:n.default.route.link,className:"btn btn-sm btn-info mr-1",href:a},"Modify"),(0,n.default)("button",{className:"btn btn-sm btn-danger mr-1"},"Delete")),(0,n.default)("td",null,e.vendor_identifier?e.vendor_identifier:e.vendor_name),(0,n.default)("td",null,e.vendor_city))};t.default=l},149:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=d(a(1)),o=(d(a(143)),d(a(142)),d(a(146)),a(5)),l=a(2),r=d(l);function d(e){return e&&e.__esModule?e:{default:e}}var s={oninit:function(e){"vendor"===e.attrs.type&&l.user.actions("getCities",!0).then(function(e){console.debug("successfully loaded "+e.length+" cities from database.")}),console.log(l.user.get("session")),console.log(r.default)},oncreate:function(e){r.default.navigation.enable(!0)},onupdate:function(e){},view:function(e){if("vendor"===e.attrs.type)return(0,n.default)("div",{className:"container-fluid mt-3"},(0,n.default)("h1",null,"Generator for Cities and Vendors"),(0,n.default)("div",{className:"row"},(0,n.default)("div",{className:"mx-auto col-lg-4"},(0,n.default)("form",{id:"generate_vendor"},(0,o.createInputGroup)({label:"Select a City",name:"city_name",input:(0,n.default)("select",{},(0,o.getCityList)()),details:"Select the city you wish to create a vendor for."}),(0,o.createInputGroup)({label:"Folder Name:",placeholder:"Enter short vendor name",name:"folder_name",details:'This doubles as both the location where your files are stored and as part of the URL to visit the vendor\'s page.<b class="text-danger">This may only contain letters and numbers.</b>'}),(0,o.createInputGroup)({label:"Vendor Name:",name:"vendor_name",placeholder:"Enter full vendor name",details:"Give the full name of the vendor"}),(0,n.default)("small",{className:"text-secondary"},"You may allow multiple people to moderate each vendor page. To include a person, simply enter their email in the field below."),(0,n.default)("div",{className:"d-flex"},(0,n.default)("label",{className:"pt-2 mr-2"},"Clients:"),(0,n.default)("div",{className:"flex-grow-1"},u())),(0,n.default)("button",{type:"button",form:"generate_vendor",onclick:i,className:"btn btn-primary"},"I'm me")))))}},u=function(){for(var e=[],t=0;t<8;t++)e.push((0,o.createInputGroup)({name:"client_"+t,value:"client test "+t}));return console.log(e),e},i=function(e){var t=document.querySelector("#generate_vendor").querySelectorAll("input, select");l.vendors.actions("generate",(0,o.buildFormData)(t)).then(function(e){return console.log(e)})};t.default=s}}]);