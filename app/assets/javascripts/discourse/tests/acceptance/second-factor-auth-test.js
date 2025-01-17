import {
  acceptance,
  exists,
  query,
} from "discourse/tests/helpers/qunit-helpers";
import { click, currentURL, fillIn, visit } from "@ember/test-helpers";
import { SECOND_FACTOR_METHODS } from "discourse/models/user";
import { test } from "qunit";

const { TOTP, BACKUP_CODE, SECURITY_KEY } = SECOND_FACTOR_METHODS;

const RESPONSES = {
  failed: {
    status: 404,
    error: "could not find an active challenge in your session",
  },
  ok111111: {
    totp_enabled: true,
    backup_enabled: true,
    security_keys_enabled: true,
    allowed_methods: [TOTP, BACKUP_CODE, SECURITY_KEY],
  },
  ok111110: {
    totp_enabled: true,
    backup_enabled: true,
    security_keys_enabled: true,
    allowed_methods: [TOTP, BACKUP_CODE],
  },
  ok110111: {
    totp_enabled: true,
    backup_enabled: true,
    security_keys_enabled: false,
    allowed_methods: [TOTP, BACKUP_CODE, SECURITY_KEY],
  },
  ok100111: {
    totp_enabled: true,
    backup_enabled: false,
    security_keys_enabled: false,
    allowed_methods: [TOTP, BACKUP_CODE, SECURITY_KEY],
  },
  ok111010: {
    totp_enabled: true,
    backup_enabled: true,
    security_keys_enabled: true,
    allowed_methods: [BACKUP_CODE],
  },
};

const WRONG_TOTP = "124323";
let callbackCount = 0;

acceptance("Second Factor Auth Page", function (needs) {
  needs.user();
  needs.pretender((server, helpers) => {
    server.get("/session/2fa.json", (request) => {
      const response = { ...RESPONSES[request.queryParams.nonce] };
      const status = response.status || 200;
      delete response.status;
      return [status, { "Content-Type": "application/json" }, response];
    });

    server.post("/session/2fa", (request) => {
      const params = helpers.parsePostData(request.requestBody);
      if (params.second_factor_token === WRONG_TOTP) {
        return [
          401,
          { "Content-Type": "application/json" },
          {
            error: "invalid token man",
            ok: false,
          },
        ];
      } else {
        return [
          200,
          { "Content-Type": "application/json" },
          {
            ok: true,
            callback_method: "PUT",
            callback_path: "/callback-path",
            redirect_path: "/",
          },
        ];
      }
    });

    server.put("/callback-path", () => {
      callbackCount++;
      return [
        200,
        { "Content-Type": "application/json" },
        {
          whatever: true,
        },
      ];
    });
  });

  needs.hooks.beforeEach(() => (callbackCount = 0));

  test("when challenge data fails to load", async function (assert) {
    await visit("/session/2fa?nonce=failed");
    assert.equal(
      query(".alert-error").textContent,
      "could not find an active challenge in your session",
      "load error message is shown"
    );
  });

  test("default 2FA method", async function (assert) {
    await visit("/session/2fa?nonce=ok111111");
    assert.ok(
      exists("#security-key-authenticate-button"),
      "security key is the default method"
    );
    assert.ok(
      !exists("form.totp-token"),
      "totp is not shown by default when security key is allowed"
    );
    assert.ok(
      !exists("form.backup-code-token"),
      "backup code form is not shown by default when security key is allowed"
    );

    await visit("/");
    await visit("/session/2fa?nonce=ok111110");
    assert.ok(
      !exists("#security-key-authenticate-button"),
      "security key method is not shown when it's not allowed"
    );
    assert.ok(
      exists("form.totp-token"),
      "totp is the default method when security key is not allowed"
    );
    assert.ok(
      !exists("form.backup-code-token"),
      "backup code form is not shown by default when TOTP is allowed"
    );

    await visit("/");
    await visit("/session/2fa?nonce=ok110111");
    assert.ok(
      !exists("#security-key-authenticate-button"),
      "security key method is not shown when it's not enabled"
    );
    assert.ok(
      exists("form.totp-token"),
      "totp is the default method when security key is not enabled"
    );
    assert.ok(
      !exists("form.backup-code-token"),
      "backup code form is not shown by default when TOTP is enabled"
    );
  });

  test("alternative 2FA methods", async function (assert) {
    await visit("/session/2fa?nonce=ok111111");
    assert.ok(
      exists(".toggle-second-factor-method.totp"),
      "TOTP is shown as an alternative method if it's enabled and allowed"
    );
    assert.ok(
      exists(".toggle-second-factor-method.backup-code"),
      "backup code is shown as an alternative method if it's enabled and allowed"
    );
    assert.ok(
      !exists(".toggle-second-factor-method.security-key"),
      "security key is not shown as an alternative method when it's selected"
    );

    await visit("/");
    await visit("/session/2fa?nonce=ok100111");
    assert.ok(
      !exists(".toggle-second-factor-method"),
      "no alternative methods are shown if only 1 method is enabled"
    );

    await visit("/");
    await visit("/session/2fa?nonce=ok111010");
    assert.ok(
      !exists(".toggle-second-factor-method"),
      "no alternative methods are shown if only 1 method is allowed"
    );
  });

  test("switching 2FA methods", async function (assert) {
    await visit("/session/2fa?nonce=ok111111");
    assert.ok(
      exists("#security-key-authenticate-button"),
      "security key form is shown because it's the default"
    );
    assert.ok(
      exists(".toggle-second-factor-method.totp"),
      "TOTP is shown as an alternative method"
    );
    assert.ok(
      exists(".toggle-second-factor-method.backup-code"),
      "backup code is shown as an alternative method"
    );
    assert.ok(
      !exists(".toggle-second-factor-method.security-key"),
      "security key is not shown as an alternative method because it's selected"
    );

    await click(".toggle-second-factor-method.totp");
    assert.ok(exists("form.totp-token"), "TOTP form is now shown");
    assert.ok(
      exists(".toggle-second-factor-method.security-key"),
      "security key is now shown as alternative method"
    );
    assert.ok(
      exists(".toggle-second-factor-method.backup-code"),
      "backup code is still shown as an alternative method"
    );
    assert.ok(
      !exists(".toggle-second-factor-method.totp"),
      "TOTP is no longer shown as an alternative method"
    );

    await click(".toggle-second-factor-method.backup-code");
    assert.ok(
      exists("form.backup-code-token"),
      "backup code form is now shown"
    );
    assert.ok(
      exists(".toggle-second-factor-method.security-key"),
      "security key is still shown as alternative method"
    );
    assert.ok(
      exists(".toggle-second-factor-method.totp"),
      "TOTP is now shown as an alternative method"
    );
    assert.ok(
      !exists(".toggle-second-factor-method.backup-code"),
      "backup code is no longer shown as an alternative method"
    );

    await click(".toggle-second-factor-method.security-key");
    assert.ok(
      exists("#security-key-authenticate-button"),
      "security key form is back"
    );
    assert.ok(
      !exists(".toggle-second-factor-method.security-key"),
      "security key is no longer shown as alternative method"
    );
    assert.ok(
      exists(".toggle-second-factor-method.totp"),
      "TOTP is now shown as an alternative method"
    );
    assert.ok(
      exists(".toggle-second-factor-method.backup-code"),
      "backup code is now shown as an alternative method"
    );
  });

  test("error when submitting 2FA form", async function (assert) {
    await visit("/session/2fa?nonce=ok110111");
    await fillIn("form.totp-token .second-factor-token-input", WRONG_TOTP);
    await click('form.totp-token .btn-primary[type="submit"]');
    assert.equal(
      query(".alert-error").textContent.trim(),
      "invalid token man",
      "error message from the server is displayed"
    );
  });

  test("successful 2FA form submit", async function (assert) {
    await visit("/session/2fa?nonce=ok110111");
    await fillIn("form.totp-token .second-factor-token-input", "323421");
    await click('form.totp-token .btn-primary[type="submit"]');
    assert.equal(
      currentURL(),
      "/",
      "user has been redirected to the redirect_path"
    );
    assert.equal(callbackCount, 1, "callback request has been performed");
  });
});
