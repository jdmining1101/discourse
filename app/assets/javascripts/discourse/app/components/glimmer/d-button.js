import GlimmerComponent from "discourse/components/glimmer";

export default class DButton extends GlimmerComponent {
  type = "button";
  form = null;
  isLoading = false;
  icon = null;
  title = null;
  translatedTitle = null;
  label = null;
  translatedLabel = null;
  translatedAriaLabel = null;
  ariaExpanded = null;

  className() {}
}
