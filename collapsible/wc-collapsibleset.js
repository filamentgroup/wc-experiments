export class Collapsibleset {

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
        var self = this;
        self.elem.querySelectorAll( "a-component[does*=collapsible]" ).forEach(function( elem ){
            elem.collapsible.collapse();
        });
    }

	bindEvents(){
        var self = this;
		window.addEventListener('expand', function(e){
            self.elem.querySelectorAll("a-component[does*=collapsible]").forEach(function( elem ){
                if( elem !== e.target ){
                    elem.collapsible.collapse();
                }
            });
        });
    }
    destructor(){
		// if needed..
	}
}