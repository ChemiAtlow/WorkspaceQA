import { Directive } from "vue";

interface ExpandedEl extends HTMLElement {
    __clickOutOf__: EventListener;
}

export const ClickOutsideDirective: Directive<ExpandedEl, EventListener> = {
    beforeMount(el, binding) {
        document.body.addEventListener("click", binding.value);
        const clickHandler = (ev: Event) => {
            if (!el.contains(ev.target as Node) && el !== ev.target) {
                binding.value(ev);
            }
        };
        el.__clickOutOf__ = clickHandler;
        document.body.addEventListener("click", clickHandler);
    },
    unmounted(el) {
        document.body.removeEventListener("click", el.__clickOutOf__);
    }
};
