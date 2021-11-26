resource "aws_route53_zone" "forum" {
  name = var.zone_name
}

resource "aws_elastic_beanstalk_application" "forum" {
  name = "forum"
}

resource "aws_elastic_beanstalk_environment" "forum_env" {
  name                = "forum-env"
  application         = aws_elastic_beanstalk_application.forum.name
  solution_stack_name = "64bit Amazon Linux 2 v3.4.9 running Docker"

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "aws-elasticbeanstalk-ec2-role"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }
}

data "aws_elastic_beanstalk_hosted_zone" "current" {

}

resource "aws_route53_record" "forum" {
  zone_id = aws_route53_zone.forum.zone_id
  name    = "forum"
  type    = "A"

  alias {
    name                   = aws_elastic_beanstalk_environment.forum_env.cname
    zone_id                = data.aws_elastic_beanstalk_hosted_zone.current.id
    evaluate_target_health = true
  }
}
