import Component from "@ember/component";
import { computed } from "@ember/object";
import { makeArray } from "discourse-common/lib/helpers";

export default Component.extend({
  tokenSeparator: "|",

  createdChoices: null,

  settingValue: computed("value", function () {
    return this.value.toString().split(this.tokenSeparator).filter(Boolean);
  }),

  settingChoices: computed(
    "setting.choices.[]",
    "createdChoices.[]",
    function () {
      return [
        ...new Set([
          ...makeArray(this.setting.choices),
          ...makeArray(
            this.createdChoices?.map((value) => ({ name: value, value }))
          ),
        ]),
      ];
    }
  ),

  actions: {
    onChangeListSetting(value) {
      this.set("value", value.join(this.tokenSeparator));
    },

    onChangeChoices(choices) {
      this.set("createdChoices", [
        ...new Set([...makeArray(this.createdChoices), ...makeArray(choices)]),
      ]);
    },
  },
});
