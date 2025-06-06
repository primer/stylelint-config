# Changelog

## 13.3.1

### Patch Changes

- [#621](https://github.com/primer/stylelint-config/pull/621) [`125cf8c`](https://github.com/primer/stylelint-config/commit/125cf8ce9c7a7418d643bb3db37f1bd88b036900) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - The declarationValueIndex function moved from lib/utils/declarationValueIndex to lib/utils/nodeFieldIndices

## 13.3.0

### Minor Changes

- [#610](https://github.com/primer/stylelint-config/pull/610) [`baf4786`](https://github.com/primer/stylelint-config/commit/baf4786ad26112003edddb4f8856b3d9428c8a89) Thanks [@langermank](https://github.com/langermank)! - - Remove unused motion token file
  - Bump `primer/primitives` 10.4.0

### Patch Changes

- [#600](https://github.com/primer/stylelint-config/pull/600) [`c172b55`](https://github.com/primer/stylelint-config/commit/c172b55d518cd723ff700c4381a149150fc4e833) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump the production-dependencies group across 1 directory with 2 updates

## 13.2.3

### Patch Changes

- [#580](https://github.com/primer/stylelint-config/pull/580) [`56c028f`](https://github.com/primer/stylelint-config/commit/56c028f6d86a7305aa4be81fde7ce50735114838) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump the production-dependencies group across 1 directory with 4 updates

- [#583](https://github.com/primer/stylelint-config/pull/583) [`2cab731`](https://github.com/primer/stylelint-config/commit/2cab731c2bf3a74617648ae02afcc96c3130de7f) Thanks [@jonrohan](https://github.com/jonrohan)! - Upgrade to stylelint@16.11.0 to avoid import change errors

## 13.2.2

### Patch Changes

- [#539](https://github.com/primer/stylelint-config/pull/539) [`2067c41`](https://github.com/primer/stylelint-config/commit/2067c4166d799ea2dbc6e90c5a6cef27ac67817a) Thanks [@jonrohan](https://github.com/jonrohan)! - Making fixes for primitives v10 rc

## 13.2.1

### Patch Changes

- [#526](https://github.com/primer/stylelint-config/pull/526) [`8672c88`](https://github.com/primer/stylelint-config/commit/8672c884c830caa93cbd59cf3d96baf30347b3a0) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump the production-dependencies group across 1 directory with 2 updates

## 13.2.0

### Minor Changes

- [#510](https://github.com/primer/stylelint-config/pull/510) [`79f2330`](https://github.com/primer/stylelint-config/commit/79f233081b8a4af3065199395ee3297b73bcaf8b) Thanks [@langermank](https://github.com/langermank)! - Update `primer/primitives` dependency

### Patch Changes

- [#520](https://github.com/primer/stylelint-config/pull/520) [`ad6fafd`](https://github.com/primer/stylelint-config/commit/ad6fafd7072dd05ab47ce9aab949ec0653ffe9fa) Thanks [@iansan5653](https://github.com/iansan5653)! - Remove comment-empty-line-before and order/properties-order rules

## 13.1.1

### Patch Changes

- [#500](https://github.com/primer/stylelint-config/pull/500) [`e0d5847`](https://github.com/primer/stylelint-config/commit/e0d5847e84a364140815a80fa22c59852c966d79) Thanks [@jonrohan](https://github.com/jonrohan)! - Removing no-unsupported-browser-features and replacing with browser-compat

## 13.1.0

### Minor Changes

- [#491](https://github.com/primer/stylelint-config/pull/491) [`a615645`](https://github.com/primer/stylelint-config/commit/a615645054778a596e918909ddb0931d018585be) Thanks [@jonrohan](https://github.com/jonrohan)! - Refactor the primer/colors variable to use primitives values match up props

### Patch Changes

- [#482](https://github.com/primer/stylelint-config/pull/482) [`b4c3fb0`](https://github.com/primer/stylelint-config/commit/b4c3fb010bf8cb84be54cdcaa73964249ab23053) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump stylelint-scss from 6.6.0 to 6.7.0 in the production-dependencies group

## 13.0.1

### Patch Changes

- [#479](https://github.com/primer/stylelint-config/pull/479) [`930e5f2`](https://github.com/primer/stylelint-config/commit/930e5f24bc01b7eebc07b085689314eea5f8e1c5) Thanks [@jonrohan](https://github.com/jonrohan)! - Stylelint fixes based on feedback:

  - `font-style` should allow keywords, `italic, normal`
  - border should allow `none` https://stylelint.io/user-guide/rules/declaration-property-value-disallowed-list
  - Update autofix in typography to always replace with the first suggestion

## 13.0.0

### Major Changes

- [#397](https://github.com/primer/stylelint-config/pull/397) [`255a3c4`](https://github.com/primer/stylelint-config/commit/255a3c4cebb453243978b24f35516ed55443c81e) Thanks [@jonrohan](https://github.com/jonrohan)! - Removing `primer/no-experimental-vars` plugin from config.

- [#415](https://github.com/primer/stylelint-config/pull/415) [`86cf24f`](https://github.com/primer/stylelint-config/commit/86cf24f5c1f3f51b5085a5808a5406bc04e47b68) Thanks [@jonrohan](https://github.com/jonrohan)! - Deleting primer/utilities plugin

- [#401](https://github.com/primer/stylelint-config/pull/401) [`0a7bc7e`](https://github.com/primer/stylelint-config/commit/0a7bc7eeaec4b6ea63cbc7bda150ea61a3b5d346) Thanks [@jonrohan](https://github.com/jonrohan)! - **BREAKING CHANGE:** Removing plugins from the config.

  - primer/new-color-vars-have-fallback
  - primer/no-deprecated-colors
  - primer/no-override
  - primer/no-scale-colors
  - primer/no-undefined-vars
  - primer/no-unused-vars

- [#397](https://github.com/primer/stylelint-config/pull/397) [`255a3c4`](https://github.com/primer/stylelint-config/commit/255a3c4cebb453243978b24f35516ed55443c81e) Thanks [@jonrohan](https://github.com/jonrohan)! - Upgrade to latest stylelint and make esm the default module format

### Minor Changes

- [#429](https://github.com/primer/stylelint-config/pull/429) [`6d80a4d`](https://github.com/primer/stylelint-config/commit/6d80a4def84a803d078e7c425ece4761c0dcbce6) Thanks [@mperrotti](https://github.com/mperrotti)! - Rewrite box-shadow lint plugin for css vars.

- [#403](https://github.com/primer/stylelint-config/pull/403) [`2c9e2de`](https://github.com/primer/stylelint-config/commit/2c9e2de5ea64754587109098352fef80718b9b30) Thanks [@mattcosta7](https://github.com/mattcosta7)! - Update config to alloy nesting in css modules

- [#417](https://github.com/primer/stylelint-config/pull/417) [`3318d25`](https://github.com/primer/stylelint-config/commit/3318d25f78f5a2a25dbe9aec077145c2a33db3af) Thanks [@jonrohan](https://github.com/jonrohan)! - Upgrade to @primer/primitives@8.2.0

- [#368](https://github.com/primer/stylelint-config/pull/368) [`0ed9a47`](https://github.com/primer/stylelint-config/commit/0ed9a4723cc1c5a1d7bbd2a36da064e76634d1b9) Thanks [@jonrohan](https://github.com/jonrohan)! - Change config to accept multiple file types `.css, .scss, .modules.css, .tsx, .pcss`

- [#400](https://github.com/primer/stylelint-config/pull/400) [`e708ed2`](https://github.com/primer/stylelint-config/commit/e708ed2ad2789e2acabcb8cb64eb99735ea87d17) Thanks [@jonrohan](https://github.com/jonrohan)! - Update primer/spacing for CSS properties

- [`4c22d43`](https://github.com/primer/stylelint-config/commit/4c22d43342857e282802f242445e25f562001a79) Thanks [@jonrohan](https://github.com/jonrohan)! - Updating `primer/borders` plugin to work for new primitives and CSS vars

## 12.9.2

### Patch Changes

- [#388](https://github.com/primer/stylelint-config/pull/388) [`43b1066`](https://github.com/primer/stylelint-config/commit/43b10662c9f48837069690751f42eed1359c7372) Thanks [@langermank](https://github.com/langermank)! - New rule: safegaurd alpha `display` color tokens

## 12.9.1

### Patch Changes

- [#382](https://github.com/primer/stylelint-config/pull/382) [`2cbe3be`](https://github.com/primer/stylelint-config/commit/2cbe3be3cecb4d7e0a9d0ad2be32ebcaceb063a5) Thanks [@langermank](https://github.com/langermank)! - Update `new-color-css-vars` to exclude scale colors

## 12.9.0

### Minor Changes

- [#376](https://github.com/primer/stylelint-config/pull/376) [`a31e0d3`](https://github.com/primer/stylelint-config/commit/a31e0d392cf73c623ae8a8cf957796ede4386e00) Thanks [@langermank](https://github.com/langermank)! - Adds new plugin: `new-color-vars-have-fallback` to check that if new Primitive v8 colors are used, they have a fallback value.

## 12.8.0

### Minor Changes

- [#356](https://github.com/primer/stylelint-config/pull/356) [`fdf5660`](https://github.com/primer/stylelint-config/commit/fdf566018fea555b6b6b0d2cfe1c6e88d8746a07) Thanks [@jonrohan](https://github.com/jonrohan)! - Upgrading to stylelint 15.10.2

### Patch Changes

- [#353](https://github.com/primer/stylelint-config/pull/353) [`cdb7ca9`](https://github.com/primer/stylelint-config/commit/cdb7ca90d4c38e429f24db92bf07578ad44d4032) Thanks [@langermank](https://github.com/langermank)! - Add `bgColor-inset` fallback for Primitives v8

## 12.7.2

### Patch Changes

- [#343](https://github.com/primer/stylelint-config/pull/343) [`5b975fc`](https://github.com/primer/stylelint-config/commit/5b975fcd45383ecd1dd9145d868a227e4fe3e27a) Thanks [@langermank](https://github.com/langermank)! - Add missing counter btn tokens to no-deprecated-colors

## 12.7.1

### Patch Changes

- [#338](https://github.com/primer/stylelint-config/pull/338) [`7cc4c08`](https://github.com/primer/stylelint-config/commit/7cc4c08f6465f495df89fc0609d3cdf012480dec) Thanks [@langermank](https://github.com/langermank)! - Add more tests to `no-deprecated-colors`

- [#328](https://github.com/primer/stylelint-config/pull/328) [`5ae7400`](https://github.com/primer/stylelint-config/commit/5ae7400340afc2cd21006093ce7b33206a00372e) Thanks [@langermank](https://github.com/langermank)! - Fix failing tests in no-deprecated-colors

- [#337](https://github.com/primer/stylelint-config/pull/337) [`6bf0fd6`](https://github.com/primer/stylelint-config/commit/6bf0fd624a69b21e48803ba62a5b2b9dc21b8d8c) Thanks [@langermank](https://github.com/langermank)! - Remove inline fallback var for no-deprecated-colors

- [#332](https://github.com/primer/stylelint-config/pull/332) [`6485cf0`](https://github.com/primer/stylelint-config/commit/6485cf053f502d71a8ce8c407ad01a939038959c) Thanks [@langermank](https://github.com/langermank)! - Updated deprecated json color file

- [#333](https://github.com/primer/stylelint-config/pull/333) [`485ce04`](https://github.com/primer/stylelint-config/commit/485ce047d75a635134919678a776ea808604cf4a) Thanks [@langermank](https://github.com/langermank)! - Adding more color replacements for deprecated colors

- [#340](https://github.com/primer/stylelint-config/pull/340) [`4688bb4`](https://github.com/primer/stylelint-config/commit/4688bb4c0ea7975672b76af8706b80278f00f1a4) Thanks [@langermank](https://github.com/langermank)! - add inlineFallback prop to no-deprecated-colors

- [#322](https://github.com/primer/stylelint-config/pull/322) [`726d7d1`](https://github.com/primer/stylelint-config/commit/726d7d1bf4eac82a032c448cb0be32d5bf66b29a) Thanks [@jonrohan](https://github.com/jonrohan)! - Updating no-deprecated-colors for primitives v8

- [#334](https://github.com/primer/stylelint-config/pull/334) [`b14c154`](https://github.com/primer/stylelint-config/commit/b14c154174ddd7190e62fe1d26698fc9cfe75c17) Thanks [@langermank](https://github.com/langermank)! - More tests for `no-deprecated-colors`

- [#339](https://github.com/primer/stylelint-config/pull/339) [`36fade4`](https://github.com/primer/stylelint-config/commit/36fade45bdc431d223165f5d7226c10cf6591d83) Thanks [@langermank](https://github.com/langermank)! - Update plugins to support Primitives v8

## 12.7.0

### Minor Changes

- [#294](https://github.com/primer/stylelint-config/pull/294) [`8bdb1d0`](https://github.com/primer/stylelint-config/commit/8bdb1d0a679c32a1782e33feb74bd8993aba5d80) Thanks [@keithamus](https://github.com/keithamus)! - allow for vars defined in scope, or within :root/:host selectors in file

## 12.6.1

### Patch Changes

- [#274](https://github.com/primer/stylelint-config/pull/274) [`4ba7018`](https://github.com/primer/stylelint-config/commit/4ba701887351664d8b937483d3d761fa5022f16c) Thanks [@jonrohan](https://github.com/jonrohan)! - Fixing issue in utilities plugin that missed certain classes

## 12.6.0

### Minor Changes

- [#272](https://github.com/primer/stylelint-config/pull/272) [`9104062`](https://github.com/primer/stylelint-config/commit/91040626d2195cbb63f1e302ae53acdd4ba5b361) Thanks [@langermank](https://github.com/langermank)! - Add no-experimental-vars plugin

## 12.5.0

### Minor Changes

- [#262](https://github.com/primer/stylelint-config/pull/262) [`28a4086`](https://github.com/primer/stylelint-config/commit/28a4086e8c781f76494c7e77b9437046a6f686a6) Thanks [@jonrohan](https://github.com/jonrohan)! - Writing a primer/utilities plugin to look for code that duplicates utilities

## 12.4.2

### Patch Changes

- [#258](https://github.com/primer/stylelint-config/pull/258) [`fa48eed`](https://github.com/primer/stylelint-config/commit/fa48eed1af84474fa49bdb7ec861d2c6a3210239) Thanks [@jonrohan](https://github.com/jonrohan)! - Fixing dependencies

* [#260](https://github.com/primer/stylelint-config/pull/260) [`4f42328`](https://github.com/primer/stylelint-config/commit/4f4232826cd3055e0e9dc49ff16925c47db21863) Thanks [@jonrohan](https://github.com/jonrohan)! - Turning off 'function-no-unknown': null,

## 12.4.1

### Patch Changes

- [#256](https://github.com/primer/stylelint-config/pull/256) [`37eb1cb`](https://github.com/primer/stylelint-config/commit/37eb1cbd342590f4c43e37779f657a4b19594eca) Thanks [@jonrohan](https://github.com/jonrohan)! - Remove stylelint peer

## 12.4.0

### Minor Changes

- [#232](https://github.com/primer/stylelint-config/pull/232) [`27ddfc9`](https://github.com/primer/stylelint-config/commit/27ddfc98f93ed898552bb62aa0926d35497dda72) Thanks [@jonrohan](https://github.com/jonrohan)! - Creating a responsive-widths plugin to keep fixed widths smaller than the minimum viewport size

* [#253](https://github.com/primer/stylelint-config/pull/253) [`0edeee0`](https://github.com/primer/stylelint-config/commit/0edeee07b1e7ef51bcd0942c65d98131ac384887) Thanks [@jonrohan](https://github.com/jonrohan)! - Changing this peerDependency to be any

## 12.3.3

### Patch Changes

- [#218](https://github.com/primer/stylelint-config/pull/218) [`c03be7d`](https://github.com/primer/stylelint-config/commit/c03be7da1126123c079d86e00a2158a913e015f8) Thanks [@jonrohan](https://github.com/jonrohan)! - [Bug fix] Catching values with dots in them

* [#217](https://github.com/primer/stylelint-config/pull/217) [`5bb2834`](https://github.com/primer/stylelint-config/commit/5bb28342a6194dfdd4fbf5197682367ea54792b7) Thanks [@jsoref](https://github.com/jsoref)! - Spelling fixes

## 12.3.2

### Patch Changes

- [#215](https://github.com/primer/stylelint-config/pull/215) [`66b16ae`](https://github.com/primer/stylelint-config/commit/66b16ae2edd81f8c8949f83c96d7011e5d395cc0) Thanks [@jonrohan](https://github.com/jonrohan)! - Making linter pick up separate function groups

## 12.3.1

### Patch Changes

- [#213](https://github.com/primer/stylelint-config/pull/213) [`2a27f86`](https://github.com/primer/stylelint-config/commit/2a27f86868b1f4717100a1f0897cdaefb1dd6be7) Thanks [@jonrohan](https://github.com/jonrohan)! - Fixing an issue where the new spacing plugin isn't traversing child sectors.

## 12.3.0

### Minor Changes

- [#191](https://github.com/primer/stylelint-config/pull/191) [`71c7985`](https://github.com/primer/stylelint-config/commit/71c79853b679b674c1d27686f8d2168660b24a45) Thanks [@jonrohan](https://github.com/jonrohan)! - Refactoring the primer/spacing plugin to better match results

## 12.2.0

### Minor Changes

- [#170](https://github.com/primer/stylelint-config/pull/170) [`b56fcd1`](https://github.com/primer/stylelint-config/commit/b56fcd1bce90d2e3e1621ef7af7545c52c935579) Thanks [@jonrohan](https://github.com/jonrohan)! - Moving config from primer/css's [stylelint.config.cjs](https://github.com/primer/css/blob/c65be7f0c8b0fb6e1ba406b5d35c6073df161a33/stylelint.config.cjs) file to this package.

* [#168](https://github.com/primer/stylelint-config/pull/168) [`d6ff2b9`](https://github.com/primer/stylelint-config/commit/d6ff2b94ff0d309c1b79e783e6ee1b2f87a375ff) Thanks [@jonrohan](https://github.com/jonrohan)! - Extending stylelint-config-standard and removing defaults

- [#170](https://github.com/primer/stylelint-config/pull/170) [`b56fcd1`](https://github.com/primer/stylelint-config/commit/b56fcd1bce90d2e3e1621ef7af7545c52c935579) Thanks [@jonrohan](https://github.com/jonrohan)! - Adding config from the [stylelint-scss recommended config](https://github.com/stylelint-scss/stylelint-config-recommended-scss/blob/82d51c399ddaa2f9d282e419399dd2028f47830c/index.js).

### Patch Changes

- [#181](https://github.com/primer/stylelint-config/pull/181) [`23e438a`](https://github.com/primer/stylelint-config/commit/23e438a7a9062550baa696cafbb186dc78b723f5) Thanks [@jonrohan](https://github.com/jonrohan)! - Turning off scss/dollar-variable-default

## 12.1.1

### Patch Changes

- [#161](https://github.com/primer/stylelint-config/pull/161) [`48c4afc`](https://github.com/primer/stylelint-config/commit/48c4afc1913863136d62967653697323f8da57b7) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump @primer/primitives from 6.1.0 to 7.0.1

## 12.1.0

### Minor Changes

- [#150](https://github.com/primer/stylelint-config/pull/150) [`4af1647`](https://github.com/primer/stylelint-config/commit/4af16474148d96fba5567068280a9ffe6e7a80ba) Thanks [@jonrohan](https://github.com/jonrohan)! - Making all be first in property order

* [#151](https://github.com/primer/stylelint-config/pull/151) [`d7c8b2b`](https://github.com/primer/stylelint-config/commit/d7c8b2b908b113fa14c7637dfced34610a3bcfac) Thanks [@jonrohan](https://github.com/jonrohan)! - Adding [string-quotes](https://stylelint.io/user-guide/rules/list/string-quotes) rule to config

### Patch Changes

- [#146](https://github.com/primer/stylelint-config/pull/146) [`214362c`](https://github.com/primer/stylelint-config/commit/214362c0e3c9449a5ff7d3bd047018493043d3c0) Thanks [@dependabot](https://github.com/apps/dependabot)! - Bump @primer/css from 13.2.0 to 16.3.0

## 12.0.1

### Patch Changes

- [#132](https://github.com/primer/stylelint-config/pull/132) [`b672367`](https://github.com/primer/stylelint-config/commit/b6723679606bb8d39e75025ae17ace9f1c3e2631) Thanks [@jonrohan](https://github.com/jonrohan)! - Updating no-deprecated-colors plugin for edge cases

## 12.0.0

### Major Changes

- [#129](https://github.com/primer/stylelint-config/pull/129) [`653d596`](https://github.com/primer/stylelint-config/commit/653d596072b897b265b093aac4cd5c143e61410e) Thanks [@jonrohan](https://github.com/jonrohan)! - Renaming the package to use org scope. This is a breaking change, you'll need to uninstall `stylelint-config-primer` and reinstall `@primer/stylelint-config`.

### Patch Changes

- [#130](https://github.com/primer/stylelint-config/pull/130) [`f495a56`](https://github.com/primer/stylelint-config/commit/f495a563a9e809252630466088eb94177e6c0be4) Thanks [@jonrohan](https://github.com/jonrohan)! - Updating @primer/primitives to 5.0 release candidate

## 11.1.1

### Patch Changes

- [`3a4654b`](https://github.com/primer/stylelint-config/commit/3a4654b1b7920d71e1284ff78a3bedff932e66a3) [#111](https://github.com/primer/stylelint-config/pull/111) Thanks [@jonrohan](https://github.com/jonrohan)! - Fixing the primer/colors and primer/borders rules

## 11.1.0

### Minor Changes

- [`e83f61c`](https://github.com/primer/stylelint-config/commit/e83f61cef3bf1df1d9420662594040efdcb86c89) [#99](https://github.com/primer/stylelint-config/pull/99) Thanks [@jonrohan](https://github.com/jonrohan)! - Create a `no-deprecated-colors` rule that looks for deprecated css color variables from primer/primitives.

### Patch Changes

- [`581f40a`](https://github.com/primer/stylelint-config/commit/581f40a4aacb45db5426b82d4a2434e81eb032e2) [#105](https://github.com/primer/stylelint-config/pull/105) Thanks [@jonrohan](https://github.com/jonrohan)! - Adding reporting to the linter to know how many variables are replaced

## 10.0.1

### Patch Changes

- [`aa76171`](https://github.com/primer/stylelint-config/commit/aa76171fc5c9c308fcd9d7f7285c8fbdb2c18a7b) [#90](https://github.com/primer/stylelint-config/pull/90) Thanks [@jonrohan](https://github.com/jonrohan)! - Updating the no-undefined-variables lint for the new color-variables mixin.

## 10.0.0

### Major Changes

- [`23a1f15`](https://github.com/primer/stylelint-config/commit/23a1f1599673f2a4f9f28c39da61f42871c05697) [#85](https://github.com/primer/stylelint-config/pull/85) Thanks [@koddsson](https://github.com/koddsson)! - Replace deprecated "blacklist" rules for "disallow list" rules.

  See https://stylelint.io/user-guide/rules/at-rule-blacklist and http://stylelint.io/user-guide/rules/declaration-property-value-disallowed-list/

### Patch Changes

- [`40d9bb8`](https://github.com/primer/stylelint-config/commit/40d9bb867194ae4335846953b5d8706dc7dc7d79) [#86](https://github.com/primer/stylelint-config/pull/86) Thanks [@koddsson](https://github.com/koddsson)! - Allow rules to optionally display a URL with their message.

## 9.3.3

### Patch Changes

- [`a339c69`](https://github.com/primer/stylelint-config/commit/a339c698b9ba7ccd01b8cb773dad7a3a14dd13a1) [#81](https://github.com/primer/stylelint-config/pull/81) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Update globby to v11

## 9.3.2

### Patch Changes

- [`d18cfbf`](https://github.com/primer/stylelint-config/commit/d18cfbfefc25be6ae38f73132552d2f3c62c4d02) [#79](https://github.com/primer/stylelint-config/pull/79) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Add additional verbose logging to `no-undefined-vars`

* [`d18cfbf`](https://github.com/primer/stylelint-config/commit/d18cfbfefc25be6ae38f73132552d2f3c62c4d02) [#79](https://github.com/primer/stylelint-config/pull/79) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Fix handling of edge-cases in `no-undefined-vars`

- [`bb07673`](https://github.com/primer/stylelint-config/commit/bb076732aa216fcb56e411b8dd7477efc89f7f8a) [#76](https://github.com/primer/stylelint-config/pull/76) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Set the default verbose option for `no-scale-colors` to false

## 9.3.1

### Patch Changes

- [`df11e2d`](https://github.com/primer/stylelint-config/commit/df11e2d912913346e0499f7eac901cdfcb83f38c) [#74](https://github.com/primer/stylelint-config/pull/74) Thanks [@BinaryMuse](https://github.com/BinaryMuse)! - Add primer/no-scale-colors to the list of exported plugins

## 9.2.1

### :bug: Bug fixes

- Fix slow runtime by caching variable definitions in `primer/no-undefined-vars` rule
- Fix duplicate errors in `primer/no-undefined-vars` rule

## 9.2.0

### :rocket: Enhancements

- New `primer/no-undefined-vars` to prohibit usages of undefined CSS variables

## 9.1.0

### :rocket: Enhancements

- The `primer/colors`, `primer/borders`, and `primer/box-shadow` rules now allow CSS color variables with the correct functional names (e.g. `var(--color-text-primary)`). #62

## 9.0.0

### :boom: Breaking Change

- `primer/variables` is no longer supported; please use the `primer/colors`, `primer/borders`, `primer/box-shadow`, `primer/spacing`, and `primer/typography` rules instead. #50

### :rocket: Enhancements

- The new `primer/colors` rule enforces color variable usage in `color`, `background-color`, and `fill` properties
- The new `primer/borders` rule enforces border variable usage in border CSS props
- The new `primer/box-shadow` rule enforces `$box-shadow*` variables
- The new `primer/spacing` rule enforces `$spacer-*` variables in margin and padding props
- The new `primer/typography` rule enforces typography variable use in `font-family`, `line-height`, and `font-weight` props
- Variable replacements for autofixing are automatically detected in variable data from Primer CSS (see: https://github.com/primer/css/pull/949) #52
- It is now possible to define variable rules using functions that take the variables, as in:
  ```js
  module.exports = createVariableRule('primer/whatever', ({variables}) => {
    /* do something with variables here */
  })
  ```
- It's also now possible to provide rule _overrides_ in local stylelint configs as functions:
  ```js
  module.exports = {
    extends: '@primer/stylelint-config',
    rules: {
      'primer/colors': [true, {
        rules: ({variables, rules}) => {
          /* do something with variables and/or rules here */
          return rules
      }]
    }
  })
  ```
- This release adds support for an optional `singular: true` flag to rule configs, which skips the parsing of individual values in the matched properties. We use this in `primer/box-shadow` to prevent multiple warnings for a single value like `box-shadow: inset 0 1px $blue` (before there would be 4 separate ones!).

### :bug: Bug fixes

- Use `requirePrimerFile()` when loading `dist/variables.json` so that we can access the right file when running _within_ the `@primer/css` repo.
- Walk only declarations (`prop: value`) in rules (blocks with selectors, _not_ `@rules`), and skip linting for declarations nested in `@each`, `@for`, `@function`, and `@mixin` blocks, since those can define their own variables and we can't reliably assert their values.
- Allow `$*-shadow` variable patterns in `primer/box-shadow` to match `$btn-active-shadow` and `$form-control-shadow`
- Allow `color: inherit` in `primer/colors`
- Allow `$em-spacer-*` in `padding` and `margin` properties
- Allow (and auto-fix!) negative spacer variables in `margin` properties
- Make `primer/colors` smarter re: `background` property shorthand values (allowing positions and image `url(*)` values)
- Remove `100%` from allowed values for `border-radius`, and suggest `50%` instead
- Prohibit negative spacer values in `padding` properties
- Allow `$h000-size` for marketing 😬

## 2.0.0

:boom: **The following updates are breaking changes**, since code that disables the deprecated rule will now produce linting errors. Please update your `stylelint-disable` statements accordingly.

- Replaced `selector-no-id: true` with `selector-max-id: 0`
- Replaced `selector-no-type: true` with `selector-max-type: 0`

The rest of the changes should not introduce new linting errors:

- Updated: moved [browserslist](https://github.com/ai/browserslist) spec to `package.json`
- Updated: using the [`no-unsupported-browser-features` plugin](https://github.com/ismay/stylelint-no-unsupported-browser-features) instead of the deprecated `no-unsupported-browser-features` rule
- Removed: `media-feature-no-missing-punctuation`
- Updated: replaced `rule-nested-empty-line-before` and `rule-non-nested-empty-line-before` with `rule-empty-line-before`

## 1.4.0

- Updated: Development dependencies are any version `*`
- Removed: `selector-class-pattern` from config. https://github.com/primer/stylelint-config/pull/11

## 1.3.0

- Added: `length-zero-no-unit` to disallow zero values with units eg `0px`

## 1.2.0

- Removed: We don't need `scss/at-extend-no-missing-placeholder` anymore taken care of by `at-rule-blacklist`
- Added: Adding `selector-no-type` to the rules

## 1.0.0

- Creating a sharable config object
