export class Snapper {
	constructor( elem ){
		this.pluginName = "snapper";
		this.elem = elem;
		var self = this;
		this.navActiveClass = this.pluginName + "_nav_item-selected";
		this.activeItemClass = this.pluginName + "_item-active";

		this.initEvent = new CustomEvent("init", {
			bubbles: true,
			cancelable: false
		});

		this.activeEvent = new CustomEvent("active", {
			bubbles: true,
			cancelable: false
		});

		this.inActiveEvent = new CustomEvent("inactive", {
			bubbles: true,
			cancelable: false
		});

		this.idItems();
		this.observeItems();
		this.defineElems();

		if( this.elem.hasAttribute( "data-snapper-nextprev") ){
			this.addNextPrev();
			this.manageArrowState();
		}
		
		this.elem.setAttribute("tabindex",0);
		this.bindEvents();

		this.elem.dispatchEvent( this.initEvent );

		this.autoplayAttr = this.elem.getAttribute( "data-snapper-autoplay");
		if( this.autoplayAttr !== null ){
			setTimeout(function(){
				self.nextAutoplay();
			});
		}
	}

	addNextPrev(){
		var	nextprev = document.createElement( "ul" );
		nextprev.innerHTML = `
			<li class="snapper_nextprev_item"><button class="snapper_nextprev_prev">Prev</button></li>
			<li class="snapper_nextprev_item"><button class="snapper_nextprev_next">Next</button></li>
		`;
		var nextprevContain = this.elem.querySelector( "." + this.pluginName + "_nextprev_contain" );
		if( !nextprevContain ){
			nextprevContain = this.elem;
		}
		nextprevContain.append( nextprev );
	}

	defineElems(){
		this.elem.classList.add( this.pluginName );
		this.slider = this.elem.querySelector( ".snapper_pane" );
		this.nav = this.elem.querySelector( ".snapper_nav" );
		this.nextprev = this.elem.querySelector( ".snapper_nextprev" );
	}


	observerCallback( entries ){
		var self = this;
		var parentElem =  this.elem;
		var navElem = this.nav;
		entries.forEach(function( entry ){
			var entryNavLink = parentElem.querySelector( "a[href='#" + entry.target.id + "']" );
			if (entry.isIntersecting && entry.intersectionRatio >= .75 ) {
				entry.target.classList.add( self.activeItemClass );
				entry.target.dispatchEvent( self.activeEvent );
				if( navElem && entryNavLink ){
					entryNavLink.classList.add( self.navActiveClass );
					if( navElem.scrollTo ){
						navElem.scrollTo({ left: entryNavLink.offsetLeft, behavior: "smooth" });
					}
					else {
						navElem.scrollLeft = entryNavLink.offsetLeft;
					}
				}
			}
			else {
				entry.target.classList.remove( self.pluginName + "_item-active" );
				entry.target.dispatchEvent( self.inActiveEvent );
				if( entryNavLink ){
					entryNavLink.classList.remove( self.navActiveClass );
				}
			}
		});
	}

	getItems(){
		return this.elem.querySelectorAll( "." + this.pluginName + "_item" );
	}

	idItems(){
		var self = this;
		this.getItems().forEach(function( item ){
			if( !item.id ){
				item.id = self.pluginName + "-" + new Date().getTime();
			}
		});
	}

	observeItems(){
		var self=this;
		var observer = new IntersectionObserver(function( entries ){
			self.observerCallback( entries );
		}, {root: self.elem, threshold: .75 });
		this.elem.querySelectorAll( "." + this.pluginName + "_item" ).forEach(function( item ){
			observer.observe( item );
		});
		observer.takeRecords();
	}

	// get the snapper_item elements whose left offsets fall within the scroll pane.
	activeItems(){
		return this.elem.querySelectorAll( "." + this.activeItemClass );
	}

	// sort an item to either end to ensure there's always something to advance to
	updateSort() {
		if( !this.elem.closest( "[data-snapper-loop]" ) ){
			return;
		}
		var scrollWidth = this.slider.scrollWidth;
		var scrollLeft = this.slider.scrollLeft;
		var contain = this.elem.querySelector( "." + this.pluginName + "_items" );
		var items = contain.querySelectorAll( "." + this.pluginName + "_item" );
		var width = this.elem.offsetWidth;

		if (scrollLeft < width ) {
		  var sortItem = items[ items.length - 1 ];
		  var sortItemWidth = sortItem.offsetWidth;
		  contain.prepend(sortItem);
		  this.elem.scrollLeft = scrollLeft + sortItemWidth;
		}
		else if (scrollWidth - scrollLeft - width <= 0 ) {
		  var sortItem = items[0];
		  var sortItemWidth = sortItem.offsetWidth;
		  contain.append(sortItem);
		  this.elem.scrollLeft = scrollLeft - sortItemWidth;
		}
	}

	

	bindEvents(){
		var self = this;
		// clicks for thumbs, nav
		this.elem.addEventListener("click", function( e ){
			self.handleClick( e );
		} );

		// keyboard arrows
		this.elem.addEventListener("keydown", function( e ){
			self.keydownHandler( e );
		} );

		// autoplay stops
		this.elem.addEventListener("click", function( e ){
			self.stopAutoplay();
		});
		this.elem.addEventListener("mouseenter", function( e ){
			self.stopAutoplay();
		});
		this.elem.addEventListener("pointerdown", function( e ){
			self.stopAutoplay();
		});
		this.elem.addEventListener("focus", function( e ){
			self.stopAutoplay();
		});
		
		// cleanup on resize 
		window.addEventListener("resize", function( e ){
		 self.manageArrowState();
		});

		var scrolling;
		this.slider.addEventListener("scroll", function( e ){
			clearTimeout(scrolling);
			scrolling = setTimeout(function(){
				self.updateSort();
				self.manageArrowState();
			},66);
		});

		this.updateSort();


	}


	

	
	resizeRetain(){
		var afterResize;
		var self = this;
		var currSlide;
		function resizeUpdates(){
			clearTimeout( afterResize );
			if( !currSlide ){
				currSlide = self.activeItems()[0];
			}
			afterResize = setTimeout( function(){
				// retain snapping on resize 
				self.goto( currSlide );
				currSlide = null;
				// resize can reveal or hide slides, so update arrows
				self.manageArrowState();
			}, 300 );
		}

	}

	manageArrowState(){
		// // old api helper here. 
		// if( $el.closest( "[data-snapper-loop], [data-loop]" ).length ){
		// 	return;
		// }
		// var pane = $el.find(".snapper_pane");
		// var nextLink = $el.find(".snapper_nextprev_next");
		// var prevLink = $el.find(".snapper_nextprev_prev");
		// var currScroll = pane[0].scrollLeft;
		// var scrollWidth = pane[0].scrollWidth;
		// var width = pane.width();

		// var noScrollAvailable = (width === scrollWidth);

		// var maxScroll = scrollWidth - width;
		// if (currScroll >= maxScroll - 3 || noScrollAvailable ) { // 3 here is arbitrary tolerance
		// 	nextLink
		// 		.addClass("snapper_nextprev-disabled")
		// 		.attr("tabindex", -1);
		// } else {
		// 	nextLink
		// 		.removeClass("snapper_nextprev-disabled")
		// 		.attr("tabindex", 0);
		// }

		// if (currScroll > 3 && !noScrollAvailable ) { // 3 is arbitrary tolerance
		// 	prevLink
		// 		.removeClass("snapper_nextprev-disabled")
		// 		.attr("tabindex", 0);
		// } else {
		// 	prevLink
		// 		.addClass("snapper_nextprev-disabled")
		// 		.attr("tabindex", -1);
		// }

		// if( noScrollAvailable ){
		// 	$el.addClass( "snapper-hide-nav" );
		// }
		// else {
		// 	$el.removeClass( "snapper-hide-nav" );
		// }
	}

	handleClick( e ){
		var self = this;

		var parentAnchor = e.target.closest( "a" );
		if( e.target.closest( ".snapper_nextprev_next" ) ){
			e.preventDefault();
			return self.arrowNavigate( true );
		}
		else if( e.target.closest( ".snapper_nextprev_prev" ) ){
			e.preventDefault();
			return self.arrowNavigate( false );
		}
		// internal links to slides
		else if( parentAnchor ){
			e.preventDefault();
			self.goto( parentAnchor.getAttribute("href") );
		}
	}


	nextAutoplay(){
		var currentActive =  this.activeItems()[0];
		var self = this;
		if(currentActive){
			var autoTiming = currentActive.getAttribute( "data-snapper-autoplay" ) || this.autoplayAttr;
			if( autoTiming !== null ){
				if( autoTiming ) {
					var thisTime = parseInt(autoTiming, 10) || 5000;
					self.autoTiming = setTimeout( function(){
						self.next();
						self.nextAutoplay();
					}, thisTime );
				}
			}
		}
	}

	stopAutoplay(){
		clearTimeout(this.autoTiming);
	}

	goto(item, parent, callback){
		var slide;
		if( !parent ){
			parent = this.slider;
		}
		if( typeof(item) === "string" ){
			//go to ID
			slide = this.elem.querySelector( item );
		}
		else if( typeof(item) === "number" ){
			//go to index
			slide = this.getItems()[ item ]
		}
		else{
			//go to obj
			slide = item
		}
		if( slide ){
			parent.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
			if( callback ){
				callback();
			}
			
		}
	}

	keydownHandler( e ){
		if( e.keyCode === 37 || e.keyCode === 38 ){
			this.stopAutoplay();
			e.preventDefault();
			e.stopImmediatePropagation();
			this.arrowNavigate( false );
		}
		if( e.keyCode === 39 || e.keyCode === 40 ){
			this.stopAutoplay();
			e.preventDefault();
			e.stopImmediatePropagation();
			this.arrowNavigate( true );
		}
	}
	



	// next/prev links or arrows should loop back to the other end when an extreme is reached
	arrowNavigate( forward ){
		if( forward ){
			this.next();
		}
		else {
			this.prev();
		}
	}


	// advance slide one full scrollpane's width forward
	next(){
		var currentActive =  this.activeItems()[0];
		if(currentActive){
			var next = currentActive.nextElementSibling;
			if( next ){
				this.goto( next );
			}
		}
	}

	// advance slide one full scrollpane's width backwards
	prev(){
		var currentActive =  this.activeItems()[0];
		if( currentActive ){
			var prev = currentActive.previousElementSibling;
			if( prev ){
				this.goto( prev );
			}
		}
	}

}
