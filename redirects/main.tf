terraform {
  backend "remote" {
    hostname              = "app.terraform.io"
    organization          = "vega"
    workspaces {
      prefix              = "docs-redirect-"
    }
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

variable "name" {
    type = string
}

resource "aws_cloudfront_function" "docs_redirects" {
  name    = var.name
  runtime = "cloudfront-js-1.0"
  publish = true
  code    = file("${path.module}/index.js")
}

output "arn" {
    value = aws_cloudfront_function.docs_redirects.arn
}