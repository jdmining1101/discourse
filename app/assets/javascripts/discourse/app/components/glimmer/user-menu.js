import GlimmerComponent from "discourse/components/glimmer";
import { action } from "@ember/object";
import { cached } from "@glimmer/tracking";

const DefaultTab = "notifications";

export default class UserMenu extends GlimmerComponent {
  activeTab = DefaultTab;

  get coreMenuButtons() {
    return [
      {
        id: DefaultTab,
        icon: "bell",
        classes: ["user-notifications-link"],
        title: "Notifications",
      },
      {
        id: "bookmarks",
        icon: "bookmark",
        classes: ["user-bookmarks-link"],
        title: "Bookmarks",
      },
      {
        id: "messages",
        icon: "envelope",
        classes: ["user-pms-link"],
        title: "Messages",
      },
      {
        id: "profile",
        icon: "user",
        classes: ["user-preferences-link"],
        title: "Preferences",
      },
    ];
  }

  @action
  changeTab(tab) {}
}
