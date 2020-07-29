export class Modal {

	constructor( elem ){
		this.elem = elem;
		this.closetext = "Close dialog";
		this.closeclass = "modal_close";
		this.closed = true;
		
		this.initEvent = new CustomEvent("init", {
			bubbles: true,
			cancelable: false
		});

		this.openEvent = new CustomEvent("open", {
			bubbles: true,
			cancelable: false
		});
	
		this.closeEvent = new CustomEvent("close", {
			bubbles: true,
			cancelable: false
		});
		this.closeBtn = this.appendCloseBtn();
		this.title = this.elem.querySelector( ".modal_title" );
		this.enhanceMarkup();
		this.bindEvents();
		this.addStyle();
		this.elem.dispatchEvent( this.initEvent );
	}

	appendCloseBtn(){
		var btn = document.createElement( "button" );
		btn.className = this.closeclass;
		btn.innerHTML = this.closetext;
		this.elem.append( btn );
		return btn;
	}

	enhanceMarkup(){
		this.elem.setAttribute( "role", "dialog" );
		this.id = this.elem.id || ("modal_" + new Date().getTime());
		this.title.id = this.title.id || ("modal_title_" + new Date().getTime());
		this.elem.setAttribute( "aria-labeledby", this.title.id );
		this.elem.classList.add("modal");
		this.overlay = document.createElement("div");
		this.overlay.className = "modal_screen";
		this.overlay.tabIndex = "-1";
		this.elem.after(this.overlay);
	}

	addStyle(){
		var style = document.createElement("style");
		style.innerText = `
			.modal, .modal_screen { position: fixed; z-index: 1000; }
			.modal_screen { top: 0; left: 0; width: 100%; height: 100vh; bottom: 0; right: 0; background: rgba(0,0,0,.5); }
			.modal:not(.modal-open),
			.modal:not(.modal-open) + .modal_screen { visibility:hidden; }
			.modal-open { z-index: 1001; background: #fff; box-sizing: border-box; padding: 5vh; top: 25vh; left: 25vw; height: 50vh; width: 50vw; }
			.modal_close { position: absolute; top: 5vh; right: 5vh; }
			[inert] {
				pointer-events: none;
				cursor: default;
			  }
			  [inert], [inert] * {
				user-select: none;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
			  }
			`;
		this.elem.append(style);
	}

	focusFirst(){
		var focusableEls = this.elem.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
		var focusableEls = Array.prototype.slice.call(focusableEls);
		focusableEls[0].focus();
	}

	inert(){
		document.body.querySelectorAll( "*" ).forEach(function(elem){
			if( !elem.closest(".modal-open") ){
				elem.inert = true;
			}
		});
	}

	unert(){
		document.querySelectorAll( "[inert]" ).forEach(function(elem){
			elem.inert = false;
		});
	}

	open(){
		var self = this;
		this.elem.classList.add( "modal-open" );
		this.focusedElem = document.activeElement;
		this.closed = false;
		this.focusFirst();
		this.elem.dispatchEvent( this.openEvent );
		setTimeout(self.inert);
	}

	close(){
		var self = this;
		setTimeout(self.unert);
		this.elem.classList.remove( "modal-open" );
		this.closed = true;
		this.elem.dispatchEvent( this.closeEvent );
		this.focusedElem.focus();
	}

	destructor(){
		// remove screen when elem is removed
		this.overlay.remove();
	}


	bindEvents(){
		var self = this;

		// close btn click
		this.closeBtn.addEventListener('click', event => self.close());

		// open dialog if click is on link to dialog
		window.addEventListener('click', function( e ){
			var assocLink = e.target.closest("a.modal_link[href='#" + self.id + "']");
			if( assocLink ){
				e.preventDefault();
				self.open();
			}
		});

		// prevent clicks outside dialog
		window.addEventListener('mouseup', function( e ){
			if( !self.closed && !e.target.closest( "#" + self.id ) ){
				e.preventDefault();
				self.close();
			}
		});

		// prevent focus outside dialog
		window.addEventListener('focusin', function( e){
			if( !self.closed && !e.target.closest( "#" + self.id ) ){
				e.preventDefault();
				self.focusFirst();
			}
		});

		// close on escape
		window.addEventListener('keydown', function( e){
			if( e.keyCode === 27 &&  !self.closed ){
				e.preventDefault();
				self.close();
			}
			
		});
	}
}