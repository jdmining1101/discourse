import GlimmerComponent from "discourse/components/glimmer";

export default class DButton extends GlimmerComponent {
  get className() {
    const classes = ["btn"];
    const hasText = !!this.args.label;
    if (!hasText) {
      classes.push("no-text");
    }
    if (this.args.icon) {
      if (hasText) {
        classes.push("btn-icon-text");
      } else {
        classes.push("btn-icon");
      }
    } else if (hasText) {
      classes.push("btn-text");
    }

    return classes.join(" ");
  }

  get icon() {

  }
}
