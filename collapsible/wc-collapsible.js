export class Collapsible {

	constructor( elem ){
		this.elem = elem;
		this.toggletext = "Toggle";
		var toggleAttr = this.elem.getAttribute("toggletext");
		this.toggletext = toggleAttr !== null ? toggleAttr : this.toggletext;
		this.collapsed = this.elem.getAttribute("collapsed") !== false;

		this.initEvent = new CustomEvent("init", {
			bubbles: true,
			cancelable: false
		});

		this.expandEvent = new CustomEvent("expand", {
			bubbles: true,
			cancelable: false
		});
	
		this.collapseEvent = new CustomEvent("collapse", {
			bubbles: true,
			cancelable: false
		});
		this.headerBtn = this.elem.firstElementChild;
		this.content = this.headerBtn.nextElementSibling;
		this.appendBtn();
		this.setRelationship();
		this.bindEvents();
		this.setState();
		this.addStyle();
		this.elem.dispatchEvent( this.initEvent );
	}

	appendBtn(){
		if( !this.headerBtn.matches( "button" ) ){
			var btn = document.createElement( "button" );
			btn.innerHTML = this.toggletext;
			this.headerBtn.append( btn );
			this.headerBtn = btn;
		}
	}

	setRelationship(){
		this.contentId = this.content.id || "collapsible_" + new Date().getTime();
		this.content.id = this.contentId;
		this.headerBtn.setAttribute( "aria-controls", this.content.id );
	}

	addStyle(){
		var style = document.createElement("style");
		style.innerText = `
			*[does=collapsible][collapsed] > *:nth-child(2) { display: none; }
		`;
		this.elem.append(style);
	}

	expand(){
		this.headerBtn.setAttribute( "aria-expanded", "true" );
		this.elem.removeAttribute( "collapsed" );
		this.collapsed = false;
		this.elem.dispatchEvent( this.expandEvent );
	}

	collapse(){
		this.headerBtn.setAttribute( "aria-expanded", "false" );
		this.elem.setAttribute( "collapsed", "" );
		this.collapsed = true;
		this.elem.dispatchEvent( this.collapseEvent );
	}

	setState(){
		if( this.collapsed ){
			this.collapse();
		}
		else {
			this.expand();
		}
	}

	toggle(){
		if( this.collapsed ){
			this.expand();
		}
		else {
			this.collapse();
		}
	}

	bindEvents(){
		var self = this;
		this.headerBtn.addEventListener('click', event => self.toggle());
	}
}