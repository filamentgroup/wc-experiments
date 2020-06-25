import {one} from './one.js';
window.one = one;
import {two} from './two.js';
window.two = two;

// a-component behavior factory
// make an a-component and give it a does= attribute with space separated classes to run
export class Component extends HTMLElement {
	connectedCallback(){
		var elem = this;
		this.bound = [];
		this.getAttribute( "does" ).split( " " ).forEach(function( func ){
			if( window[func] ){
				elem.bound.push( [new window[func](elem), func] );
				elem.classList.add("defined");
				elem.dispatchEvent( new Event("create." + func, {"bubbles":true, "cancelable":false}) );
			}
		});
	}
	disconnectedCallback(){
		this.bound.forEach(function( func ){
			document.dispatchEvent( new Event("destroy." + func[1], {"bubbles":true, "cancelable":false}) );
			if( func[0].destructor ){
				func[0].destructor();
			}
		});
	}
}

if ('customElements' in window) {
	customElements.define('a-component', Component );
}