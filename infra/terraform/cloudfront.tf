# # --- CloudFront Function ---
# resource "aws_cloudfront_function" "add_extention" {
#   name    = "shotrip-prod-add-extention"
#   runtime = "cloudfront-js-2.0"
#   comment = "shotrip-prod-add-extention"
#   publish = true
#   code    = <<EOF
# function handler(event) {
#     var request = event.request;
#     var uri = request.uri;

#     if (uri.endsWith('/')) {
#         request.uri += 'index.html';
#     } else if (!uri.includes('.')) {
#         request.uri += '.html';
#     }

#     return request;
# }
# EOF
# }


# # --- Origin Access Control (OAC) ---
# resource "aws_cloudfront_origin_access_control" "s3_oac" {
#   name                              = "shotrip-prod-hosting-oac"
#   description                       = "OAC for shotrip-prod-hosting"
#   origin_access_control_origin_type = "s3"
#   signing_behavior                  = "always"
#   signing_protocol                  = "sigv4"
# }

# # --- CloudFront Distribution ---
# resource "aws_cloudfront_distribution" "main" {
#   enabled             = true
#   is_ipv6_enabled     = true
#   comment             = "shotrip-prod"
#   default_root_object = "index.html"
  
#   price_class = "PriceClass_All"

#   lifecycle {
#     ignore_changes = [web_acl_id]
#   }

#   origin {
#     domain_name              = "shotrip-prod-web-hosting.s3.ap-northeast-1.amazonaws.com"
#     origin_id                = "shotrip-prod-hosting.s3.ap-northeast-1.amazonaws.com"
#     origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
#   }

#   default_cache_behavior {
#     target_origin_id       = "shotrip-prod-hosting.s3.ap-northeast-1.amazonaws.com"
#     viewer_protocol_policy = "redirect-to-https"
#     allowed_methods        = ["GET", "HEAD"]
#     cached_methods         = ["GET", "HEAD"]
#     cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"

#     function_association {
#       event_type   = "viewer-request"
#       function_arn = aws_cloudfront_function.add_extention.arn
#     }
#   }

#   dynamic "custom_error_response" {
#     for_each = [403, 404, 500]
#     content {
#       error_code            = custom_error_response.value
#       response_code         = custom_error_response.value
#       response_page_path    = "/${custom_error_response.value}.html"
#       error_caching_min_ttl = 10
#     }
#   }

#   aliases = ["www.shotrip.jp"]

#   viewer_certificate {
#     acm_certificate_arn      = data.aws_acm_certificate.www.arn
#     ssl_support_method       = "sni-only"
    
#     minimum_protocol_version = "TLSv1.3_2025"
#   }

#   restrictions {
#     geo_restriction {
#       restriction_type = "none"
#     }
#   }

#   tags = {
#     Env           = var.env
#     Name          = "shotrip-prod"
#     Project       = var.project
#     SecurityLevel = title(var.securitylevel)
#   }
# }