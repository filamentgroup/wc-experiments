// Create a class for the element

class TextExpand extends HTMLTextAreaElement {
	connectedCallback() {
	  this.addEventListener('input', event => this.setHeight() );
	}

	setHeight(){
		this.style.height = this.scrollHeight + "px";
	}
  
}
  // Define the new element
  customElements.define('text-expand', TextExpand, { extends: 'textarea' });

  export default TextExpand;

  
