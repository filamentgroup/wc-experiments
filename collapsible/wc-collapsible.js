class Collapsible extends HTMLElement {

	constructor(){
		super();
		this.headerBtn = this;
		this.content = this.headerBtn.nextElementSibling;
		this.contentId = this.content.id || "collapsible_" + new Date().getTime();
		this.collapsed = false;
		this.addA11yAttrs();
		this.bindEvents();
		this.collapse();
        this.checkInteractivity();
	}

	addA11yAttrs(){
		this.headerBtn.setAttribute( "aria-controls", this.contentId );
		this.content.id = this.contentId;
	}

	removeA11yAttrs(){
		this.content.removeAttribute( "data-hidden" );
	}


	isNonInteractive(){
		var computedContent = window.getComputedStyle( this.content, null );
		var computedHeader = window.getComputedStyle( this.headerBtn, null );
		return computedContent.getPropertyValue( "display" ) !== "none" && computedContent.getPropertyValue( "visibility" ) !== "hidden" && ( computedHeader.getPropertyValue( "cursor" ) === "default" || computedHeader.getPropertyValue( "display" ) === "none" );
	}

	checkInteractivity(){
		if( this.isNonInteractive() ){
			this.removeA11yAttrs();
		}
		else{
			this.setState();
			this.addA11yAttrs();
		}
	}

	expand(){
		this.headerBtn.setAttribute( "aria-expanded", "true" );
		this.content.setAttribute( "data-hidden", "false" );
		this.collapsed = false;
	}

	collapse(){
		this.headerBtn.setAttribute( "aria-expanded", "false" );
		this.content.setAttribute( "data-hidden", "true" );
		this.collapsed = true;
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

		this.headerBtn.addEventListener( "click", function( e ){
			e.preventDefault();
			self.toggle();
        });
    
		var resizepoll;
		window.addEventListener( "resize", function(){
			if( resizepoll ){
				window.clearTimeout( resizepoll );
			}
			resizepoll = window.setTimeout( function(){
				self.checkInteractivity.call( self );
			}, 150 );
		} );
	}
}
  
if ('customElements' in window) {
	customElements.define('collapsible-toggle', Collapsible);
}

export default Collapsible;