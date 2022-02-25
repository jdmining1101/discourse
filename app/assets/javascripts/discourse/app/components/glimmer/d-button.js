import GlimmerComponent from "discourse/components/glimmer";
import { tracked } from "@glimmer/tracking";
import I18n from "I18n";
import { action } from "@ember/object";

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
    if (this.args.isLoading) {
      classes.push("is-loading");
    }
    if (this.args.flat) {
      classes.push("btn-flat");
    }
    return classes.join(" ");
  }

  get disabled() {
    return this.args.isLoading || this.args.disabled;
  }

  get computedLabel() {
    if (this.args.label) {
      return I18n.t(this.args.label);
    } else if (this.args.translatedLabel) {
      return this.args.translatedLabel;
    }
  }

  get computedTitle() {
    if (this.args.title) {
      return I18n.t(this.args.title);
    } else if (this.args.translatedTitle) {
      return this.args.translatedTitle;
    }
  }

  get computedAriaLabel() {
    if (this.args.ariaLabel) {
      return I18n.t(this.args.ariaLabel);
    } else if (this.args.translatedAriaLabel) {
      return this.args.translatedAriaLabel;
    }
  }

  @action
  onClick() {
    if (this.args.onClick) {
      this.args.onClick();
    }
  }
}
