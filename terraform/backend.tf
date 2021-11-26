terraform {
  backend "remote" {
    organization = "muktiarafi"

    workspaces {
      name = "forum-api"
    }
  }
}
