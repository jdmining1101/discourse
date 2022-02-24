import GlimmerComponent from "discourse/components/glimmer";
import { action } from "@ember/object";
import { cached } from "@glimmer/tracking";

const DefaultTab = "notifications";

export default class UserMenu extends GlimmerComponent {
  activeTab = DefaultTab;

  get coreMenuButtons() {
    const tabs = [
      {
        id: DefaultTab,
        icon: "bell",
        classNames: ["user-notifications-link"],
        title: "Notifications",
      },
      {
        id: "bookmarks",
        icon: "bookmark",
        classNames: ["user-bookmarks-link"],
        title: "Bookmarks",
      },
      {
        id: "messages",
        icon: "envelope",
        classNames: ["user-pms-link"],
        title: "Messages",
      },
      {
        id: "profile",
        icon: "user",
        classNames: ["user-preferences-link"],
        title: "Preferences",
      },
    ];
    tabs.forEach((tab) => {
      tab.classNames.push("menu-link");
      tab.className = tab.classNames.join(" ");
      delete tab.classNames;
    });
    return tabs;
  }

  @action
  changeTab(tab) {}
}
