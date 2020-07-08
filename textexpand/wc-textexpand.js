// Create a class for the element
export function textexpand ( elem ) {
	elem.addEventListener('input', event => elem.setHeight() );

	function setHeight(){
		elem.style.height = elem.scrollHeight + "px";
	}
}


  
