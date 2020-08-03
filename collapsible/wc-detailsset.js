export class Detailsset {

	constructor( elem ){
        this.elem = elem;
        var self = this;

		this.initEvent = new CustomEvent("init", {
			bubbles: true,
			cancelable: false
		});

        this.bindEvents();
        setTimeout(function(){
            self.setState();
        });
		this.elem.dispatchEvent( this.initEvent );
    }

	setState(){
        this.elem.querySelectorAll( "details" ).forEach(function( elem ){
            elem.open = false;
        });
    }

	bindEvents(){
        var self = this;
		this.elem.addEventListener('click', function(e){
            self.elem.querySelectorAll("details").forEach(function( elem ){
                if( elem !== e.target ){
                    elem.open = false;
                }
            });
        });
    }
    destructor(){
		// if needed..
	}
}