import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  // Slice 6 — send-path contract.
  // supabase/functions/_shared/sendPromotion.ts is the ONLY file allowed to
  // talk to the email provider. Everything else must route through
  // sendPromotion() (financial promotions) or dispatchEmail() (neutral mail),
  // so that fn_can_promote() is re-checked at send time and every promotion is
  // logged before dispatch.
  {
    files: ["**/*.{ts,tsx}"],
    // The Slice 6 gate test asserts the ban itself, so it must be able to
    // name the provider.
    ignores: [
      "supabase/functions/_shared/sendPromotion.ts",
      "src/test/slice6-recertification.test.ts",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/resend/i]",
          message:
            "Direct email-provider access is banned. Use sendPromotion() / dispatchEmail() in supabase/functions/_shared/sendPromotion.ts.",
        },
        {
          selector: "ImportDeclaration[source.value=/resend/i]",
          message:
            "Direct email-provider access is banned. Use sendPromotion() / dispatchEmail() in supabase/functions/_shared/sendPromotion.ts.",
        },
        {
          selector: "TemplateElement[value.raw=/resend/i]",
          message:
            "Direct email-provider access is banned. Use sendPromotion() / dispatchEmail() in supabase/functions/_shared/sendPromotion.ts.",
        },
      ],
    },
  },
);
