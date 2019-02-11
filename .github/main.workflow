workflow "lint & test" {
  on = "push"
  resolves = [
    "lint",
    "primer/publish@v1.0.0",
  ]
}

action "install" {
  uses = "actions/npm@master"
  args = "ci"
}

action "lint" {
  needs = "install"
  uses = "actions/npm@master"
  args = "run lint"
}

action "test" {
  needs = "install"
  uses = "actions/npm@master"
  args = "test"
}

action "primer/publish@v1.0.0" {
  uses = "primer/publish@v1.0.0"
  needs = ["test"]
  secrets = ["GITHUB_TOKEN", "NPM_AUTH_TOKEN"]
}
