import GlimmerComponent from "discourse/components/glimmer";
import { Promise } from "rsvp";
import { tracked } from "@glimmer/tracking";

export default class QuickAccessPanel extends GlimmerComponent {
  @tracked isLoadin = false;

  get hideBottomItems() {
    return false;
  }

  get hasUnread() {
    return false;
  }

  get showAllHref() {
    return "";
  }

  findNewItems() {
    return Promise.resolve([]);
  }
}
