import GlimmerComponent from "discourse/components/glimmer";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import DiscourseURL from "discourse/lib/url";

const DefaultTabId = "notifications";
const DefaultTabComponent = "glimmer/quick-access-notifications";

export default class UserMenu extends GlimmerComponent {
  @tracked activeTabId = DefaultTabId;
  @tracked activeTabComponent = DefaultTabComponent;

  get coreMenuButtons() {
    const buttons = [
      {
        id: DefaultTabId,
        icon: "bell",
        classNames: ["user-notifications-link"],
        title: "Notifications",
        url: `${this.currentUser.path}/notifications`,
        tabComponent: DefaultTabComponent,
      },
      {
        id: "bookmarks",
        icon: "bookmark",
        classNames: ["user-bookmarks-link"],
        title: "Bookmarks",
        url: `${this.currentUser.path}/bookmarks`,
        tabComponent: "glimmer/quick-access-bookmarks",
      },
      {
        id: "messages",
        icon: "envelope",
        classNames: ["user-pms-link"],
        title: "Messages",
        url: `${this.currentUser.path}/messages`,
        tabComponent: "glimmer/quick-access-messages",
      },
      {
        id: "profile",
        icon: "user",
        classNames: ["user-preferences-link"],
        title: "Preferences",
        url: `${this.currentUser.path}/preferences`,
        tabComponent: "glimmer/quick-access-profile",
      },
    ];
    buttons.forEach((button) => {
      button.classNames.push("menu-link");
      if (this.activeTabId === button.id) {
        button.classNames.push("active");
        button.active = true;
      }
      button.className = button.classNames.join(" ");
      delete button.classNames;
    });
    return buttons;
  }

  get activeTabComponent() {}

  @action
  changeTab(button) {
    if (button.id !== this.activeTabId) {
      this.activeTabId = button.id;
      this.activeTabComponent = button.tabComponent;
    } else if (button.url) {
      DiscourseURL.routeTo(button.url);
    }
  }
}
