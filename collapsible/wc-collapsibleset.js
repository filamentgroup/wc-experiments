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
    
    getCollapsibleInstance( elem ){
        var ret;
        elem.bound.forEach(function( func ){
            if( func[1] === "collapsible" ){
                ret = func[0];
            }
        });
        return ret;
    }

	setState(){
        var self = this;
        self.elem.querySelectorAll( "a-component[does*=collapsible]" ).forEach(function( elem ){
            self.getCollapsibleInstance( elem ).collapse();
        });
    }

	bindEvents(){
        var self = this;
		window.addEventListener('expand', function(e){
            self.elem.querySelectorAll("a-component[does*=collapsible]").forEach(function( elem ){
                if( elem !== e.target ){
                    self.getCollapsibleInstance( elem ).collapse();
                }
            });
        });
    }
    destructor(){
		// if needed..
	}
}