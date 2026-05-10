resource "aws_iam_role" "github_actions" {
  name = "github-actions-workflow-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRoleWithWebIdentity"
      Effect = "Allow"
      Principal = { Federated = aws_iam_openid_connect_provider.github.arn }
      Condition = {
        StringLike = {
          "token.actions.githubusercontent.com:sub" : "repo:${var.github_prod_repo}:*"
        }
      }
    }]
  })
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_iam_role_policy_attachment" "admin_access" {
  role       = aws_iam_role.github_actions.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}


output "github_actions_role_arn" {
  value = aws_iam_role.github_actions.arn
}