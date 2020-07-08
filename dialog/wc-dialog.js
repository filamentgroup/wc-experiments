class Dialog extends HTMLElement {
	connectedCallback() {
		const parent = this;
		parent.classList.add("dialog-enhanced");
		
		const content = this.querySelector('.dialog_content');

	}
}
  
if ('customElements' in window) {
	customElements.define('fg-dialog', Dialog);
}

export default Collapsible;