class Collapsible extends HTMLElement {
	connectedCallback() {
		const parent = this;
		parent.classList.add("collapsible-enhanced");
		
		const header = this.querySelector('h2,h3,h4,.collapsible-header');
		header.classList.add("collapsible-header");
		header.setAttribute("role", "button");
		header.setAttribute("tabindex", "0");
		header.setAttribute("aria-expanded", !parent.hasAttribute("collapsed") );

		const content = this.querySelector('div,p,.collapsible-content');
		content.classList.add("collapsible-content");

		header.addEventListener('click', evt => {
			parent.toggleAttribute("collapsed");
			header.setAttribute("aria-expanded", !parent.hasAttribute("collapsed"));
		});
	}
}
  
if ('customElements' in window) {
	customElements.define('collapsible-toggle', Collapsible);
}

export default Collapsible;