
// a-component behavior factory
// make an a-component and give it a does= attribute with space separated classes to run
export class Component extends HTMLElement {
	connectedCallback(){
		var elem = this;
		this.getAttribute( "does" ).split( " " ).forEach(function( func ){
			if( window[func] ){
				elem[ func ] = new window[func](elem);
				elem.classList.add("defined");
				elem.dispatchEvent( new Event("create." + func, {"bubbles":true, "cancelable":false}) );
			}
		});
	}
	disconnectedCallback(){
		var elem = this;
		this.getAttribute( "does" ).split( " " ).forEach(function( func ){
			document.dispatchEvent( new Event("destroy." + func, {"bubbles":true, "cancelable":false}) );
			if( elem[func].destructor ){
				elem[func].destructor();
			}
		});
	}
}

if ('customElements' in window) {
	customElements.define('a-component', Component );
}